// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card } from '@nextui-org/card';
import React, { useEffect, useState } from 'react';
import { usePostDataContext, useApiContext } from '@/contexts';
import { BN } from '@polkadot/util';
import useCurrentBlock from '@/hooks/useCurrentBlock';
import blockToTime from '@/utils/blockToTime';
import networkConstants from '@/global/networkConstants';
import { Progress } from '@nextui-org/progress';
import { Tooltip } from '@nextui-org/tooltip';

function formatTimePassed(seconds: number): string {
	const days = Math.floor(seconds / (24 * 60 * 60));
	const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));

	const daysDisplay = days > 0 ? `${days}d ` : '';
	const hoursDisplay = `${hours}h`;

	return daysDisplay + hoursDisplay;
}

function formatTimeRemaining(seconds: number): string {
	const days = Math.floor(seconds / (24 * 60 * 60));
	const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
	const minutes = Math.floor((seconds % (60 * 60)) / 60);

	if (days > 0) {
		return `${days}d ${hours}h`;
	}

	return `${hours}h ${minutes}m`;
}

function DecisionStatusCard() {
	const {
		postData: { on_chain_info: onChainInfo }
	} = usePostDataContext();
	const { network, api, apiReady } = useApiContext();
	const currentBlock = useCurrentBlock();
	const [decisionPeriod, setDecisionPeriod] = useState<BN | null>(null);

	useEffect(() => {
		if (!api || !apiReady) return;

		// Convert 7 days to blocks using network's block time
		const blockTime = networkConstants[network].blockTime / 1000; // Convert to seconds
		const secondsInDay = 24 * 60 * 60;
		const blocksInDay = secondsInDay / blockTime;
		const decisionPeriodBlocks = new BN(Math.floor(7 * blocksInDay));
		setDecisionPeriod(decisionPeriodBlocks);
	}, [api, apiReady, network]);

	if (!onChainInfo?.deciding || !currentBlock || !decisionPeriod) return null;

	const { since, confirming } = onChainInfo.deciding;

	// Decision period calculations
	const blocksPassed = new BN(currentBlock).sub(new BN(since));
	const { seconds: secondsPassed } = blockToTime(blocksPassed, network);
	const blocksRemaining = decisionPeriod.sub(blocksPassed);
	const { seconds: secondsRemaining } = blockToTime(blocksRemaining, network);

	const timePassed = formatTimePassed(secondsPassed);
	const timeRemaining = formatTimeRemaining(secondsRemaining);
	const decisionProgress = Math.min(100, (blocksPassed.toNumber() / decisionPeriod.toNumber()) * 100);
	const isDecisionComplete = decisionProgress >= 100;

	// Confirmation period calculations
	let confirmationProgress = 0;
	let confirmationTimePassed = '0m';
	let confirmationTimeRemaining = '30m';
	let isConfirmationComplete = false;

	if (confirming) {
		const confirmationBlocksPassed = new BN(currentBlock).sub(new BN(confirming));
		const { seconds: confirmationSecondsPassed } = blockToTime(confirmationBlocksPassed, network);

		// 30 minutes in seconds
		const confirmationPeriodSeconds = 30 * 60;
		confirmationProgress = Math.min(100, (confirmationSecondsPassed / confirmationPeriodSeconds) * 100);
		isConfirmationComplete = confirmationProgress >= 100;

		const minutesPassed = Math.floor(confirmationSecondsPassed / 60);
		const minutesRemaining = Math.max(0, 30 - minutesPassed);

		confirmationTimePassed = `${minutesPassed}m`;
		confirmationTimeRemaining = `${minutesRemaining}m`;
	}

	return (
		<Card
			className='flex flex-col gap-6 border border-primary_border bg-cardBg px-4 py-6'
			shadow='none'
			radius='lg'
		>
			<h3 className='text-lg font-semibold'>Status</h3>

			<section className='flex flex-col gap-2'>
				<Tooltip
					content={
						<span className='text-xs'>
							{isDecisionComplete ? 'Decision period completed' : `${timeRemaining} remaining, ${decisionProgress.toFixed(2)}%(${timePassed} has gone)`}
						</span>
					}
				>
					<Progress
						aria-label='Decision Progress'
						value={decisionProgress}
						classNames={{
							track: 'bg-gray-200',
							indicator: 'bg-primary'
						}}
					/>
				</Tooltip>
				<div className='flex items-center justify-between gap-5 text-sm'>
					<span>Decision</span>
					<span className='text-sm text-gray-500'>7d</span>
				</div>
			</section>

			<section className='flex flex-col gap-2'>
				<Tooltip
					content={
						<span className='text-xs'>
							{!confirming
								? 'Confirmation not started yet'
								: isConfirmationComplete
									? 'Confirmation period completed'
									: `${confirmationTimeRemaining} remaining, ${confirmationProgress.toFixed(2)}%(${confirmationTimePassed} has gone)`}
						</span>
					}
				>
					<Progress
						aria-label='Confirmation Progress'
						value={confirmationProgress}
						classNames={{
							track: 'bg-gray-200',
							indicator: 'bg-primary'
						}}
					/>
				</Tooltip>
				<div className='flex items-center justify-between gap-5 text-sm'>
					<span>Confirmation</span>
					<span className='text-sm text-gray-500'>30mins</span>
				</div>
			</section>
		</Card>
	);
}

export default DecisionStatusCard;
