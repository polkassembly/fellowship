// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import networkConstants from '@/global/networkConstants';
import MESSAGES from '@/global/messages';
import { APIError } from '@/global/exceptions';

interface Args {
	query: string;
	variables?: object;
	network: string;
}

export default async function fetchSubsquid({ query, variables, network }: Args) {
	return fetch(`${networkConstants[String(network)]?.subsquidUrl}`, {
		body: JSON.stringify(variables ? { query, variables } : { query }),
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST'
	})
		.then((res) => res.json())
		.then((result) => result)
		.catch((e) => {
			// eslint-disable-next-line no-console
			console.error('error in fetchSubsquid : ', e);

			throw new APIError(MESSAGES.SUBSQUID_FETCH_ERROR, 500, 'SUBSQUID_ERROR');
		});
}
