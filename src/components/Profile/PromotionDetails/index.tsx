// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useEffect, useState } from 'react';
import { Progress } from '@nextui-org/progress';
import { Card } from '@nextui-org/card';
import { useApiContext } from '@/contexts';
import Image from 'next/image';
import useCurrentBlock from '@/hooks/useCurrentBlock';
import { BN } from '@polkadot/util';
import blockToTime from '@/utils/blockToTime';
import { SubsquidActivityType, UserActivityListingItem } from '@/global/types';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import { Divider } from '@nextui-org/divider';
import { Tooltip } from '@nextui-org/tooltip';
import dayjs from 'dayjs';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';

interface Props {
	address: string;
}

interface ActivityPeriod {
	blocksPassed: BN;
	daysTotal: number;
	daysPassed: number;
	daysRemaining: number;
	progress: number;
}

interface ProgressSectionProps {
	title: string;
	progress: number;
	daysPassed: number;
	daysTotal: number;
	daysRemaining: number;
}

function ProgressSection({ title, progress, daysPassed, daysTotal, daysRemaining }: ProgressSectionProps) {
	const [timeRemaining, setTimeRemaining] = useState<string>('');

	const formatTimeRemaining = (seconds: number) => {
		const duration = dayjs.duration(seconds, 'seconds');
		const timeUnits = [
			{ unit: 'years', label: 'y' },
			{ unit: 'months', label: 'mo' },
			{ unit: 'days', label: 'd' },
			{ unit: 'hours', label: 'h' },
			{ unit: 'minutes', label: 'm' }
		] as const;

		// Find first non-zero unit
		const primaryUnit = timeUnits.find(({ unit }) => duration[unit]() > 0);
		if (!primaryUnit) return '0m';

		// Find next non-zero unit for additional precision
		const remainingUnits = timeUnits.slice(timeUnits.indexOf(primaryUnit) + 1);
		const secondaryUnit = remainingUnits.find(({ unit }) => duration[unit]() > 0);

		const primaryValue = duration[primaryUnit.unit]();
		const primaryFormatted = `${primaryValue}${primaryUnit.label}`;

		if (!secondaryUnit) return primaryFormatted;

		const secondaryValue = duration[secondaryUnit.unit]();
		return `${primaryFormatted} ${secondaryValue}${secondaryUnit.label}`;
	};

	useEffect(() => {
		const now = dayjs();
		const end = now.add(daysRemaining, 'day');
		const seconds = end.diff(now, 'second');
		setTimeRemaining(formatTimeRemaining(seconds));
	}, [daysRemaining]);

	return (
		<div className='flex flex-col gap-y-2'>
			<div className='flex items-center gap-x-2'>
				<h4 className='text-base font-semibold leading-6'>{title}</h4>
				<Tooltip
					content={
						<div className='mb-2 flex items-center justify-between gap-x-2'>
							<p className='text-sm text-gray-500'>{title === 'Promotion Details' ? 'Time until promotion eligibility:' : 'Time until demotion:'}</p>
							<p className='text-sm font-medium text-primary'>{timeRemaining}</p>
						</div>
					}
					showArrow
				>
					<Image
						alt='Info Icon'
						src='/icons/info.svg'
						width={20}
						height={20}
						className='dark:grayscale dark:invert dark:filter'
					/>
				</Tooltip>
			</div>

			<div className='flex items-center gap-x-2'>
				<Progress
					aria-label={`${title} Progress`}
					radius='sm'
					size='sm'
					value={progress}
					className='flex-1'
					color='primary'
				/>
				<p className='ml-auto flex min-w-20 items-center justify-end text-xs font-normal text-secondaryText/70'>
					{daysRemaining > 0 ? `${daysPassed}/${daysTotal} days` : title === 'Promotion Details' ? 'promotable' : 'demotable'}
				</p>
			</div>
		</div>
	);
}

function PromotionDetails({ address }: Props) {
	const { fellows, network, api } = useApiContext();
	const currentBlock = useCurrentBlock();
	const fellow = fellows.find((f) => f.address === address);
	const params = fellow?.params;

	const [lastPromotion, setLastPromotion] = useState<UserActivityListingItem | null>(null);
	const [lastDemotion, setLastDemotion] = useState<UserActivityListingItem | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchActivities = async () => {
			const { data: activities, error } = await nextApiClientFetch<UserActivityListingItem[]>({
				url: `api/v1/address/${address}/activity/rank`,
				isPolkassemblyAPI: false,
				method: 'POST',
				network
			});

			if (error) {
				console.error(error);
				return;
			}

			const promotion = activities?.find((activity) =>
				[SubsquidActivityType.Promoted, SubsquidActivityType.PromotionRequest, SubsquidActivityType.Inducted, SubsquidActivityType.Imported].includes(activity.activityType)
			);
			const demotion = activities?.find((activity) => activity?.otherActions?.toRank === fellow?.rank);
			setLastPromotion(promotion || null);
			setLastDemotion(demotion || null);
			setLoading(false);
		};

		if (address && network) {
			fetchActivities();
		}
	}, [address, network, fellow?.rank]);

	if (!params || !currentBlock || !api) return null;

	if (loading) {
		return (
			<Card className='h-full min-h-[180px] rounded-[20px] border border-primary_border bg-cardBg px-4 py-6'>
				<div className='flex h-full items-center justify-center'>
					<LoadingSpinner message='Loading promotion details...' />
				</div>
			</Card>
		);
	}

	const calculatePeriod = (lastActivity: UserActivityListingItem | null, periodBlocks: BN): ActivityPeriod => {
		const blocksPassed = lastActivity ? new BN(currentBlock || 0).sub(new BN(lastActivity.createdAtBlock || 0)) : new BN(0);

		const periodTime = blockToTime(periodBlocks, network);
		const passedTime = blockToTime(blocksPassed, network);

		const daysTotal = Math.ceil(periodTime.seconds / (24 * 60 * 60));
		const daysPassed = Math.ceil(passedTime.seconds / (24 * 60 * 60));
		const daysRemaining = Math.max(0, daysTotal - daysPassed);
		const progress = Math.min(100, (daysPassed / daysTotal) * 100);

		return { blocksPassed, daysTotal, daysPassed, daysRemaining, progress };
	};

	if (!params || !currentBlock || !api) return null;

	const promotionPeriod = calculatePeriod(lastPromotion, new BN(params.minPromotionPeriod));

	const demotionPeriod = calculatePeriod(lastDemotion, new BN(params.demotionPeriod));

	return (
		<Card className='min-h-[180px] rounded-[20px] border border-primary_border bg-cardBg px-4 py-6'>
			<div className='flex flex-col gap-y-4'>
				{/* Promotion Section */}
				<ProgressSection
					title='Promotion Details'
					progress={promotionPeriod.progress}
					daysPassed={promotionPeriod.daysPassed}
					daysTotal={promotionPeriod.daysTotal}
					daysRemaining={promotionPeriod.daysRemaining}
				/>

				<Divider className='h-0.5 w-full' />

				{/* Demotion Section */}
				<ProgressSection
					title='Demotion Details'
					progress={demotionPeriod.progress}
					daysPassed={demotionPeriod.daysPassed}
					daysTotal={demotionPeriod.daysTotal}
					daysRemaining={demotionPeriod.daysRemaining}
				/>
			</div>
		</Card>
	);
}

export default PromotionDetails;
