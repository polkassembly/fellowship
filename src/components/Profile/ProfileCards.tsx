// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useMemo } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Progress } from '@nextui-org/progress';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { useApiContext } from '@/contexts';
import LinkWithNetwork from '../Misc/LinkWithNetwork';

interface Props {
	address: string;
	className?: string;
}

function ProfileCards({ address, className }: Props) {
	const { fellows } = useApiContext();

	const fellow = useMemo(() => {
		return fellows.find((f) => f.address === address);
	}, [address, fellows]);

	const currentSalary = fellow?.params?.activeSalary?.[0] || '0';

	// Mock data for demonstration - in real implementation, these would come from API
	const promotionProgress = 75;
	const retentionDeadline = 45;
	const salaryIncrease = 5.2;

	return (
		<div className={`grid grid-cols-1 gap-6 md:grid-cols-3 ${className}`}>
			{/* Promotion Progress Card */}
			<Card className='border border-primary_border bg-cardBg p-3'>
				<CardHeader className='pb-3'>
					<h3 className='flex items-center gap-2 font-semibold text-black dark:text-white'>
						<TrendingUp className='h-5 w-5 text-primary_accent' />
						Promotion Progress
					</h3>
				</CardHeader>
				<CardBody>
					<div className='space-y-3'>
						<div className='flex justify-between text-sm'>
							<span className='text-text_secondary'>{fellow ? `Dan ${fellow.rank} → Dan ${fellow.rank + 1}` : 'Member → Fellow'}</span>
							<span className='font-semibold text-black dark:text-white'>{promotionProgress}%</span>
						</div>
						<Progress
							value={promotionProgress}
							className='h-2'
							color='primary'
						/>
						<div className='text-xs text-text_secondary'>Next milestone: 3 months remaining</div>
					</div>
				</CardBody>
			</Card>

			{/* Retention Deadline Card */}
			<Card className='border border-primary_border bg-cardBg p-3'>
				<CardHeader className='pb-3'>
					<h3 className='flex items-center gap-2 font-semibold text-black dark:text-white'>
						<Calendar className='h-5 w-5 text-orange-500' />
						Retention Deadline
					</h3>
				</CardHeader>
				<CardBody>
					<div className='space-y-3'>
						<div className='text-2xl font-semibold text-black dark:text-white'>{retentionDeadline} days</div>
						<div className='text-sm text-text_secondary'>Evidence submission required</div>
						<Button
							size='sm'
							className='w-full bg-orange-500 font-medium text-white hover:bg-orange-600'
							as={LinkWithNetwork}
							href='/submit-evidence'
						>
							Submit Evidence
						</Button>
					</div>
				</CardBody>
			</Card>

			{/* Current Salary Card */}
			<Card className='border border-primary_border bg-cardBg p-3'>
				<CardHeader className='pb-3'>
					<h3 className='flex items-center gap-2 font-semibold text-black dark:text-white'>
						<DollarSign className='h-5 w-5 text-green-500' />
						Current Salary
					</h3>
				</CardHeader>
				<CardBody>
					<div className='space-y-3'>
						<div className='text-2xl font-semibold text-black dark:text-white'>{currentSalary} DOT</div>
						<div className='text-sm text-text_secondary'>Per cycle (30 days)</div>
						<div className='flex items-center gap-1 text-xs text-green-600'>
							<TrendingUp className='h-3 w-3' />+{salaryIncrease}% from last cycle
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}

export default ProfileCards;
