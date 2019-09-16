/*
 * Copyright 2019 NEM
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
/**
 * Catapult REST Endpoints
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.7.18
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { MultisigAccountInfoDTO } from './multisigAccountInfoDTO';

export class MultisigAccountGraphInfoDTO {
    /**
    * Level of the multisig account.
    */
    'level': number;
    /**
    * Array of multisig accounts for this level.
    */
    'multisigEntries': Array<MultisigAccountInfoDTO>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "level",
            "baseName": "level",
            "type": "number"
        },
        {
            "name": "multisigEntries",
            "baseName": "multisigEntries",
            "type": "Array<MultisigAccountInfoDTO>"
        }    ];

    static getAttributeTypeMap() {
        return MultisigAccountGraphInfoDTO.attributeTypeMap;
    }
}

