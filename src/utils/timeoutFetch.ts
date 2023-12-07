// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import fetchPonyfill from 'fetch-ponyfill';

const { fetch: fetchPF } = fetchPonyfill();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function fetchWithTimeout(resource: any, options: any) {
	const { timeout = 8000 } = options;

	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);

	const response = await fetchPF(resource, {
		...options,
		signal: controller.signal
	});
	clearTimeout(id);

	return response;
}
