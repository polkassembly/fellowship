// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { ClientError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { Network, IProfile } from '@/global/types';
import fetchPonyfill from 'fetch-ponyfill';

const { fetch: fetchPF } = fetchPonyfill();

interface Args {
	originUrl: string;
	address: string;
	network?: Network;
}

export default async function getProfile({ originUrl, address, network }: Args) {
	const addressRes = await fetchPF(`${originUrl}/api/v1/address/${address}`, {
		headers: {
			'x-network': network || ''
		},
		method: 'GET'
	}).catch((e) => {
		throw new ClientError(`${MESSAGES.API_FETCH_ERROR} - ${e?.message}`, API_ERROR_CODE.API_FETCH_ERROR);
	});

	const profile: IProfile = await addressRes.json();

	return profile;
}
