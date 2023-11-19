// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiPromise } from '@polkadot/api';
import getSubstrateAddress from './getSubstrateAddress';

export default async function getAllFellowAddresses(api: ApiPromise): Promise<string[]> {
	return new Promise((resolve, reject) => {
		api.query.fellowshipCollective.members
			.entries()
			.then((entries: any) => {
				const members: string[] = [];

				for (let i = 0; i < entries.length; i += 1) {
					// key split into args part to extract
					const [
						{
							args: [accountId]
						},
						optInfo
					] = entries[Number(i)];
					if (optInfo.isSome) {
						members.push(getSubstrateAddress(accountId.toString()) || accountId.toString());
					}
				}

				// for testing and development purposes
				if (process.env.NEXT_PUBLIC_FELLOW_ADDRESS) {
					members.push(getSubstrateAddress(process.env.NEXT_PUBLIC_FELLOW_ADDRESS) || '');
				}

				resolve(members);
			})
			.catch((error: Error) => reject(error));
	});
}
