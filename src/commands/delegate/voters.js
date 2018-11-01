/*
 * LiskHQ/lisk-commander
 * Copyright © 2017–2018 Lisk Foundation
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
import { flags as flagParser } from '@oclif/command';
import BaseCommand from '../../base';
import getAPIClient from '../../utils/api';
import query from '../../utils/query';
import { SORT_FIELDS } from '../../utils/constants';

const MAXIMUM_LIMIT = 100;

const processFlagInputs = (limitStr, offsetStr, sortStr) => {
	const limit = parseInt(limitStr, 10);
	const offset = parseInt(offsetStr, 10);
	const sort = sortStr ? sortStr.trim() : undefined;
	if (limitStr !== limit.toString() || !Number.isInteger(limit) || limit <= 0) {
		throw new Error('Limit must be an integer and greater than 0');
	}
	if (limit && limit > MAXIMUM_LIMIT) {
		throw new Error(`Maximum limit amount is ${MAXIMUM_LIMIT}`);
	}
	if (
		offsetStr !== offset.toString() ||
		!Number.isInteger(offset) ||
		offset < 0
	) {
		throw new Error('Offset must be an integer and greater than or equal to 0');
	}
	if (!SORT_FIELDS.includes(sort)) {
		throw new Error(`Sort must be one of: ${SORT_FIELDS.join(', ')}`);
	}

	return {
		limit,
		offset,
		sort,
	};
};

export default class VotersCommand extends BaseCommand {
	async run() {
		const {
			args: { usernames },
			flags: { limit: limitStr, offset: offsetStr, sort: sortStr },
		} = this.parse(VotersCommand);

		const { limit, offset, sort } = processFlagInputs(
			limitStr,
			offsetStr,
			sortStr,
		);

		const req = usernames.map(username => ({
			query: {
				username,
				limit: limit || 10,
				offset: offset || 0,
				sort: sort || 'balance:desc',
			},
			placeholder: {
				username,
				message: 'Delegate not found.',
			},
		}));
		const client = getAPIClient(this.userConfig.api);
		const results = await query(client, 'voters', req);
		this.print(results);
	}
}

VotersCommand.args = [
	{
		name: 'usernames',
		required: true,
		description: 'Comma-separated username(s) to get information about.',
		parse: input => input.split(',').filter(Boolean),
	},
];

VotersCommand.flags = {
	...BaseCommand.flags,
	limit: flagParser.string({
		description: 'Limit applied to results.',
		default: '10',
	}),
	offset: flagParser.string({
		description: 'Offset applied to results.',
		default: '0',
	}),
	sort: flagParser.string({
		description: 'Fields to sort results by.',
		default: 'balance:desc',
	}),
};

VotersCommand.description = `
Gets voters information for given delegate(s) from the blockchain.
`;

VotersCommand.examples = [
	'delegate:voters lightcurve',
	'delegate:voters lightcurve,4miners.net',
	'delegate:voters lightcurve,4miners.net --limit 20 --offset 5 --sort publicKey:asc --pretty',
];
