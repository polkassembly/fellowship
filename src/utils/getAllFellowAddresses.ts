// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiPromise } from '@polkadot/api';
import { IFellow } from '@/global/types';
import getSubstrateAddress from './getSubstrateAddress';

export default async function getAllFellowAddresses(api: ApiPromise): Promise<IFellow[]> {
	return new Promise((resolve, reject) => {
		api.query.fellowshipCollective.members
			.entries()
			.then(async (entries: any) => {
				const members: IFellow[] = [];
				const { activeSalary, demotionPeriod, minPromotionPeriod, offboardTimeout, passiveSalary }: any = (await api.query.fellowshipCore.params()).toJSON();

				for (let i = 0; i < entries.length; i += 1) {
					// key split into args part to extract
					const [
						{
							args: [accountId]
						},
						optInfo
					] = entries[Number(i)];

					if (optInfo.isSome) {
						members.push({
							address: getSubstrateAddress(accountId.toString()) || accountId.toString() || '',
							rank: optInfo.toJSON()?.rank || 0,
							salary: activeSalary?.[optInfo.toJSON()?.rank || 0],
							params: {
								activeSalary: activeSalary?.[optInfo.toJSON()?.rank || 0],
								demotionPeriod: demotionPeriod?.[optInfo.toJSON()?.rank || 0],
								minPromotionPeriod: minPromotionPeriod?.[optInfo.toJSON()?.rank || 0],
								offboardTimeout,
								passiveSalary: passiveSalary?.[optInfo.toJSON()?.rank || 0]
							}
						});
					}
				}

				// sort by rank
				members.sort((a, b) => b.rank - a.rank);

				resolve(members);
			})
			.catch((error: Error) => reject(error));
	});
}
