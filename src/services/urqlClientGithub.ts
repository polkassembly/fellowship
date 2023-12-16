// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Client, fetchExchange } from '@urql/core';
import { cacheExchange } from '@urql/exchange-graphcache';

export const urqlClientGithub = () => {
	const { GITHUB_TOKEN } = process.env;

	if (!GITHUB_TOKEN) {
		throw new Error('GITHUB_TOKEN not set');
	}

	return new Client({
		url: 'https://api.github.com/graphql',
		exchanges: [cacheExchange(), fetchExchange],
		fetchOptions: {
			headers: {
				Authorization: `Bearer ${GITHUB_TOKEN}`
			}
		}
	});
};
