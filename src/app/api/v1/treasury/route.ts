// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import getNetworkFromHeaders from '@/app/api/api-utils/getNetworkFromHeaders';
import withErrorHandling from '@/app/api/api-utils/withErrorHandling';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { APIError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { ApiPromise, WsProvider } from '@polkadot/api';
import networkConstants from '@/global/networkConstants';

interface TreasuryData {
	cycleIndex: number;
	cycleProgress: number;
	totalCycleDays: number;
	daysRemaining: number;
	lastPayoutDaysAgo: number;
	nextPayoutDays: number;
	treasurySpendPeriod: number;
	currentSpendingPeriod: number;
	spendingProgress: number;
}

async function getCurrentBlock(api: ApiPromise) {
	return await api.rpc.chain.getHeader();
}

async function getTreasuryData(api: ApiPromise): Promise<TreasuryData> {
	try {
		// Check if treasury module exists
		if (!api.consts.treasury) {
			// Check for fellowship salary cycle instead
			if (api.consts.fellowshipSalary) {
				const registrationPeriod = api.consts.fellowshipSalary.registrationPeriod as any;
				const registrationPeriodValue = registrationPeriod?.toJSON() || 0;

				// Get current block
				const currentBlock = await getCurrentBlock(api);

				// Use registration period as cycle length (this is an approximation)
				const cycleLength = registrationPeriodValue * 10; // Multiply by 10 for longer cycles
				const currentCycle = Math.floor(currentBlock.number.toNumber() / cycleLength);
				const cycleProgress = ((currentBlock.number.toNumber() % cycleLength) / cycleLength) * 100;

				// Convert blocks to days (assuming 6 second block time for collectives)
				const blocksPerDay = (24 * 60 * 60) / 6; // 14400 blocks per day
				const daysRemaining = Math.ceil((cycleLength - (currentBlock.number.toNumber() % cycleLength)) / blocksPerDay);
				const totalCycleDays = Math.ceil(cycleLength / blocksPerDay);

				return {
					cycleIndex: currentCycle,
					cycleProgress: Math.round(cycleProgress),
					totalCycleDays,
					daysRemaining,
					lastPayoutDaysAgo: 0,
					nextPayoutDays: daysRemaining,
					treasurySpendPeriod: cycleLength,
					currentSpendingPeriod: currentCycle,
					spendingProgress: Math.round(cycleProgress)
				};
			}

			// Return default values if no modules found
			return {
				cycleIndex: 0,
				cycleProgress: 0,
				totalCycleDays: 0,
				daysRemaining: 0,
				lastPayoutDaysAgo: 0,
				nextPayoutDays: 0,
				treasurySpendPeriod: 0,
				currentSpendingPeriod: 0,
				spendingProgress: 0
			};
		}

		// Get treasury spend period information
		const spendPeriod = api.consts.treasury.spendPeriod as any;
		const treasurySpendPeriod = (spendPeriod?.toJSON() as number) || 0;

		// Get current block
		const currentBlock = await getCurrentBlock(api);

		// Calculate current spending period
		const currentSpendingPeriod = Math.floor(currentBlock.number.toNumber() / treasurySpendPeriod);
		const spendingProgress = ((currentBlock.number.toNumber() % treasurySpendPeriod) / treasurySpendPeriod) * 100;

		// Convert blocks to days (assuming 6 second block time)
		const blocksPerDay = (24 * 60 * 60) / 6; // 14400 blocks per day
		const daysRemaining = Math.ceil((treasurySpendPeriod - (currentBlock.number.toNumber() % treasurySpendPeriod)) / blocksPerDay);
		const totalCycleDays = Math.ceil(treasurySpendPeriod / blocksPerDay);

		return {
			cycleIndex: currentSpendingPeriod,
			cycleProgress: Math.round(spendingProgress),
			totalCycleDays,
			daysRemaining,
			lastPayoutDaysAgo: 0, // This would need to be fetched from historical data
			nextPayoutDays: daysRemaining,
			treasurySpendPeriod,
			currentSpendingPeriod,
			spendingProgress: Math.round(spendingProgress)
		};
	} catch (error) {
		console.error('Error fetching treasury data:', error);
		throw error;
	}
}

export const GET = withErrorHandling(async (req: NextRequest) => {
	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	if (!network) {
		throw new APIError(`${MESSAGES.INVALID_PARAMS_ERROR}`, 500, API_ERROR_CODE.INVALID_PARAMS_ERROR);
	}

	try {
		// Create API connection
		const wsProvider = networkConstants[String(network)]?.rpcEndpoints?.[0]?.key;
		if (!wsProvider) {
			throw new APIError('No RPC endpoint available for network', 500, 'RPC_ERROR');
		}

		const provider = new WsProvider(wsProvider);
		const api = new ApiPromise({ provider });

		await api.isReady;

		const treasuryData = await getTreasuryData(api);

		await api.disconnect();

		return NextResponse.json(treasuryData);
	} catch (error) {
		console.error('Error in treasury API:', error);
		throw new APIError('Failed to fetch treasury data', 500, 'TREASURY_FETCH_ERROR');
	}
});
