/*
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fetch from 'node-fetch';
import { defer, from as observableFrom, Observable, of as observableOf } from 'rxjs';
import { Configuration, NodeRoutesApi, Pagination, querystring } from 'twix-openapi-typescript-fetch-client';
import { NetworkType } from '../model/network';
import { Page } from './Page';
import { RepositoryCallError } from './RepositoryCallError';

/**
 * Http extended by all http services
 */
export abstract class Http {
    /**
     * Constructor
     * @param url Base catapult-rest url
     * @param fetchApi fetch function to be used when performing rest requests.
     */
    protected constructor(protected readonly url: string, protected readonly fetchApi?: any) {}

    public static async errorHandling(error: any): Promise<Error> {
        if (error instanceof Error) {
            return error;
        }
        const statusCode: number = parseInt(error?.status || error?.statusCode || error?.response?.statusCode || 0);
        const statusMessage: string = (
            error?.statusText ||
            error?.statusMessage ||
            error?.response?.statusMessage ||
            'Unknown Error'
        ).toString();

        const toString = (body: any): string => {
            if (!body) {
                return '';
            }
            if (typeof body === 'string' || body instanceof String) {
                return body.toString();
            }
            return JSON.stringify(body);
        };

        const getBody = async (error: any): Promise<string> => {
            const body = error?.response?.body;
            if (body) {
                return toString(body);
            }
            if (error.text) {
                return toString(await error.text());
            }
            return '';
        };

        const formattedError: RepositoryCallError = {
            statusCode,
            statusMessage,
            body: await getBody(error),
        };
        return new Error(JSON.stringify(formattedError));
    }

    createNetworkTypeObservable(networkType?: NetworkType | Observable<NetworkType>): Observable<NetworkType> {
        if (networkType && networkType instanceof Observable) {
            return networkType as Observable<NetworkType>;
        } else if (networkType) {
            return observableOf(networkType as NetworkType);
        } else {
            return defer(() => this.call(new NodeRoutesApi(this.config()).getNodeInfo(), (body) => body.networkIdentifier));
        }
    }

    public config(): Configuration {
        const fetchApi = this.fetchApi || (typeof window !== 'undefined' && window.fetch.bind(window)) || fetch;
        return new Configuration({ basePath: this.url, fetchApi: fetchApi, queryParamsStringify: querystring });
    }

    /**
     * This method knows how to call, convert and handle exception when doing remote http operations.
     * @param remoteCall the remote call
     * @param mapper the mapper from dto to the model object.
     */
    protected call<D, M>(remoteCall: Promise<D>, mapper: (value: D) => M): Observable<M> {
        return observableFrom(
            new Promise<M>((resolve, reject) =>
                remoteCall.then(
                    async (a) => {
                        try {
                            resolve(mapper(a));
                        } catch (e) {
                            reject(await Http.errorHandling(e));
                        }
                    },
                    async (e) => reject(await Http.errorHandling(e)),
                ),
            ),
        );
    }

    /**
     * This method maps a rest page object from rest to the SDK's Page model object.
     *
     * @internal
     * @param pagination rest pagination object.
     * @param data rest pagination data object.
     * @param mapper the mapper from dto to the model object.
     * @param networkType the network type.
     * @returns Page<T> model
     */
    protected toPage<D, M>(
        pagination: Pagination,
        data: D[],
        mapper: (value: D, networkType?: NetworkType) => M,
        networkType?: NetworkType,
    ): Page<M> {
        return new Page<M>(
            data.map((d) => mapper(d, networkType)),
            pagination?.pageNumber,
            pagination?.pageSize,
        );
    }
}
