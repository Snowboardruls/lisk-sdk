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

import { APIClient } from './api_client';
import { Channel } from './types';

export const createWSClient = async (url: string): Promise<APIClient> => {
	// FIXME: requires real implementation
	const channel = ({ url } as unknown) as Channel;
	await channel.connect();
	const client = new APIClient(channel);
	await client.connect();

	return client;
};
