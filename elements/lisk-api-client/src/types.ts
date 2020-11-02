/*
 * Copyright © 2020 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */

import { Schema } from '@liskhq/lisk-codec';

export interface EventInfoObject<T> {
	readonly module: string;
	readonly name: string;
	readonly data: T;
}
export type EventCallback<T> = (event: EventInfoObject<T>) => void | Promise<void>;

export interface Channel {
	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
	invoke: <T>(actionName: string, params?: Record<string, unknown>) => Promise<T>;
	subscribe: <T>(eventName: string, cb: EventCallback<T>) => void;
}

export interface RegisteredSchemas {
	account: Schema;
	block: Schema;
	blockHeader: Schema;
	blockHeadersAssets: { [version: number]: Schema };
	transaction: Schema;
	transactionsAssets: {
		moduleID: number;
		moduleName: string;
		assetID: number;
		assetName: string;
		schema: Schema;
	}[];
}

export interface RegisteredModule {
	id: number;
	name: string;
	actions: string[];
	events: string[];
	reducers: string[];
	transactionAssets: {
		id: number;
		name: string;
	}[];
}

export interface GenesisConfig {
	[key: string]: unknown;
	bftThreshold: number;
	communityIdentifier: string;
	blockTime: number;
	maxPayloadLength: number;
	rewards: {
		milestones: string[];
		offset: number;
		distance: number;
	};
	minFeePerByte: number;
	baseFees: {
		moduleID: number;
		assetID: number;
		baseFee: string;
	}[];
}

export interface NodeInfo {
	version: string;
	networkVersion: string;
	networkIdentifier: string;
	lastBlockID: string;
	height: number;
	finalizedHeight: number;
	syncing: boolean;
	unconfirmedTransactions: number;
	genesisConfig: GenesisConfig;
	registeredModules: RegisteredModule[];
}

export interface MultiSignatureKeys {
	readonly mandatoryKeys: Buffer[];
	readonly optionalKeys: Buffer[];
	readonly numberOfSignatures: number;
}
