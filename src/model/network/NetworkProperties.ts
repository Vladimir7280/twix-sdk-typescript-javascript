/*
 * Copyright 2020 NEM
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

import { NodeIdentityEqualityStrategy } from 'twix-openapi-typescript-fetch-client';

/**
 * Network related configuration properties.
 */
export class NetworkProperties {
    /**
     * @param identifier - Network identifier.
     * @param nodeEqualityStrategy - Node equality strategy. Defines if the identifier for the node must be its public key or host.
     * @param nemesisSignerPublicKey - Nemesis public key.
     * @param generationHashSeed - Seed for generate nemesis generation hash.
     * @param epochAdjustment - Nemesis epoch time adjustment.
     */
    constructor(
        public readonly identifier?: string,
        public readonly nodeEqualityStrategy?: NodeIdentityEqualityStrategy,
        public readonly nemesisSignerPublicKey?: string,
        public readonly generationHashSeed?: string,
        public readonly epochAdjustment?: string,
    ) {}
}
