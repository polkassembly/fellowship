// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { getLocalStorageToken } from '@/services/auth.service';
import MESSAGES from '@/global/messages';
import POLKASSEMBLY_API_URL from '@/global/polkassemblyApiUrl';
import { Network } from '@/global/types';
import getNetwork from './getNetwork';

interface Args {
	url: string;
	data?: { [key: string]: unknown };
	method?: 'GET' | 'POST';
	isPolkassemblyAPI?: boolean;
	network: Network;
}

async function nextApiClientFetch<T>({ url, data, method, isPolkassemblyAPI = true, network = getNetwork() }: Args): Promise<{ data?: T; error?: string }> {
	const currentURL = new URL(window.location.href);
	const token = currentURL.searchParams.get('token') || getLocalStorageToken();

	const response = await fetch(`${isPolkassemblyAPI ? POLKASSEMBLY_API_URL : window.location.origin}/${url}`, {
		body: JSON.stringify(data),
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			'x-network': network
		},
		method: method ?? (data ? 'POST' : 'GET')
	});

	const resJSON = await response.json();

	if (response.status === 200)
		return {
			data: resJSON as T
		};

	return {
		error: resJSON.message || MESSAGES.API_FETCH_ERROR
	};
}

export default nextApiClientFetch;
