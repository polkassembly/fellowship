// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiPromise } from '@polkadot/api';
import { IFellow } from '@/global/types';
import getSubstrateAddress from './getSubstrateAddress';

// Whitelisted fellows (for testing or manual additions)
const WHITELISTED_FELLOWS: string[] = ['YS7UCpmCREYUa3dgbVWfQQT88Vi9MZGiyxc5DRoaEysvFSz', '5FeNKdFRh9Ue2EM3C7yMkPe8BQMsxUL7e6QqqTaym6saviZX'];

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
							salary: activeSalary?.[optInfo.toJSON()?.rank] || 0,
							params: {
								activeSalary: activeSalary?.[optInfo.toJSON()?.rank] || 0,
								demotionPeriod: demotionPeriod?.[optInfo.toJSON()?.rank] || 0,
								minPromotionPeriod: minPromotionPeriod?.[optInfo.toJSON()?.rank] || 0,
								offboardTimeout,
								passiveSalary: passiveSalary?.[optInfo.toJSON()?.rank] || 0
							}
						});
					}
				}

				// Add whitelisted fellows if not already in the list
				WHITELISTED_FELLOWS.forEach((whitelistedAddress) => {
					const substrateAddress = getSubstrateAddress(whitelistedAddress) || whitelistedAddress;
					const alreadyExists = members.some((m) => m.address === substrateAddress);

					if (!alreadyExists) {
						// Add with rank 1 (Member) and default params
						members.push({
							address: substrateAddress,
							rank: 1,
							salary: activeSalary?.[1] || 0,
							params: {
								activeSalary: activeSalary?.[1] || 0,
								demotionPeriod: demotionPeriod?.[1] || 0,
								minPromotionPeriod: minPromotionPeriod?.[1] || 0,
								offboardTimeout,
								passiveSalary: passiveSalary?.[1] || 0
							}
						});
					}
				});

				// sort by rank
				members.sort((a, b) => b.rank - a.rank);

				resolve(members);
			})
			.catch((error: Error) => reject(error));
	});
}
