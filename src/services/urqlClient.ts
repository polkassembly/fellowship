// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import networkConstants from '@/global/networkConstants';
import { Client, fetchExchange } from '@urql/core';
import { cacheExchange } from '@urql/exchange-graphcache';

export const urqlClient = (network: string) => {
	return new Client({
		url: networkConstants[String(network)]?.subsquidUrl,
		exchanges: [cacheExchange(), fetchExchange]
	});
};
