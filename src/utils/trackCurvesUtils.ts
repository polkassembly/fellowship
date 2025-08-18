// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BigNumber from 'bignumber.js';
import { Network, ProposalType } from '@/global/types';

// Simplified network details for track functions
const NETWORKS_DETAILS: Record<string, any> = {
	collectives: {
		trackDetails: {
			fellowship_referendums: {
				minApproval: {
					reciprocal: {
						factor: 1000000000,
						xOffset: 1000000000,
						yOffset: 0
					}
				},
				minSupport: {
					reciprocal: {
						factor: 1000000000,
						xOffset: 1000000000,
						yOffset: 0
					}
				},
				decisionPeriod: 100800 // 7 days in blocks (assuming 6s block time)
			}
		}
	}
};

export function makeReciprocalCurve(reciprocal: { factor: number; xOffset: number; yOffset: number }) {
	if (!reciprocal) {
		return null;
	}
	const { factor, xOffset, yOffset } = reciprocal;
	return function fn(percentage: number) {
		const x = percentage * 10 ** 9;

		const v = new BigNumber(factor)
			.div(new BigNumber(x).plus(xOffset))
			.multipliedBy(10 ** 9)
			.toFixed(0, BigNumber.ROUND_DOWN);

		const calcValue = new BigNumber(v)
			.plus(yOffset)
			.div(10 ** 9)
			.toString();
		return BigNumber.max(calcValue, 0).toNumber();
	};
}

export function makeLinearCurve(linearDecreasing: { length: number; floor: number; ceil: number }) {
	if (!linearDecreasing) {
		return null;
	}
	const { length, floor, ceil } = linearDecreasing;
	return function fn(percentage: number) {
		const x = percentage * 10 ** 9;

		const xValue = BigNumber.min(x, length);
		const slope = new BigNumber(ceil).minus(floor).dividedBy(length);
		const deducted = slope.multipliedBy(xValue).toString();

		const perbill = new BigNumber(ceil).minus(deducted).toFixed(0, BigNumber.ROUND_DOWN);
		const calcValue = new BigNumber(perbill).div(10 ** 9).toString();
		return BigNumber.max(calcValue, 0).toNumber();
	};
}

export function getTrackFunctions({ network, trackName }: { network: Network; trackName: ProposalType }) {
	const trackInfo = NETWORKS_DETAILS[network]?.trackDetails?.[trackName];
	if (!trackInfo) {
		return {
			approvalCalc: null,
			supportCalc: null
		};
	}

	let supportCalc = null;
	let approvalCalc = null;
	if (trackInfo) {
		if (trackInfo.minApproval) {
			if (trackInfo.minApproval.reciprocal) {
				approvalCalc = makeReciprocalCurve(trackInfo.minApproval.reciprocal);
			} else if (trackInfo.minApproval.linearDecreasing) {
				approvalCalc = makeLinearCurve(trackInfo.minApproval.linearDecreasing);
			}
		}
		if (trackInfo.minSupport) {
			if (trackInfo.minSupport.reciprocal) {
				supportCalc = makeReciprocalCurve(trackInfo.minSupport.reciprocal);
			} else if (trackInfo.minSupport.linearDecreasing) {
				supportCalc = makeLinearCurve(trackInfo.minSupport.linearDecreasing);
			}
		}
	}
	return {
		approvalCalc,
		supportCalc
	};
}
