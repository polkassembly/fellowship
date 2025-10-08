// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useEffect, useState } from 'react';
import { Wallet, Calendar } from 'lucide-react';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Progress } from '@nextui-org/progress';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import formatSalary from '@/utils/formatSalary';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import LinkWithNetwork from '../../Misc/LinkWithNetwork';
import LoadingSpinner from '../../Misc/LoadingSpinner';

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

export default function Treasury({ isFellow }: Readonly<{ isFellow: boolean }>) {
	const { network, fellows } = useApiContext();
	const { addresses } = useUserDetailsContext();

	const [treasuryData, setTreasuryData] = useState<TreasuryData | null>(null);
	const [userSalary, setUserSalary] = useState<string>('0');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			if (!network) {
				return;
			}

			try {
				setLoading(true);
				setError(null);

				// Fetch treasury data
				const { data: treasury, error: treasuryError } = await nextApiClientFetch<TreasuryData>({
					network,
					url: 'api/v1/treasury',
					isPolkassemblyAPI: false
				});

				if (treasuryError || !treasury) {
					console.error('Error fetching treasury data:', treasuryError);
					setError('Failed to load treasury data');
					return;
				}

				setTreasuryData(treasury);

				// Get user's salary if they are a fellow (use same logic as members table)
				if (isFellow && addresses && addresses.length > 0) {
					const userAddress = getSubstrateAddress(addresses[0] || '');
					const fellow = fellows?.find((f) => f.address === userAddress);

					if (fellow) {
						// Use the same salary value as in the members table (fellow.salary)
						setUserSalary(fellow.salary || '0');
					}
				}
			} catch (err) {
				console.error('Error fetching treasury data:', err);
				setError('Failed to load treasury data');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [network, isFellow, addresses, fellows]);

	return (
		<div className='border-b border-primary_border p-4'>
			<Card className='border-primary_border'>
				<CardHeader>
					<div className='font-poppins flex items-center gap-2 text-text_secondary'>
						<Wallet className='h-5 w-5' />
						Treasury & Salary
					</div>
				</CardHeader>
				<CardBody className='space-y-4'>
					{loading && (
						<div className='flex justify-center py-8'>
							<LoadingSpinner message='Loading treasury data...' />
						</div>
					)}

					{error && <div className='py-4 text-center text-sm text-text_secondary'>{error}</div>}

					{!loading && !error && (
						<>
							<div className='space-y-2'>
								<div className='flex items-center justify-between'>
									<span className='font-poppins text-sm text-text_secondary'>Treasury Cycle</span>
									<span className='font-poppins text-sm text-text_secondary'>Cycle #{treasuryData?.cycleIndex || 0}</span>
								</div>
								<div className='space-y-1'>
									<div className='flex justify-between text-sm'>
										<span className='font-poppins text-text_secondary'>Progress</span>
										<span className='font-poppins text-text_secondary'>
											{(treasuryData?.totalCycleDays || 0) - (treasuryData?.daysRemaining || 0)}/{treasuryData?.totalCycleDays || 0} days
										</span>
									</div>
									<Progress
										value={treasuryData?.cycleProgress || 0}
										className='w-full'
									/>
								</div>
							</div>

							<div className='space-y-2'>
								{isFellow && userSalary !== '0' && (
									<div className='flex items-center justify-between'>
										<span className='font-poppins text-sm text-text_secondary'>Your Salary</span>
										<span className='font-poppins text-sm text-text_secondary'>{formatSalary(userSalary)}</span>
									</div>
								)}
								<div className='font-poppins text-xs text-text_secondary'>
									{(treasuryData?.lastPayoutDaysAgo || 0) > 0 ? `Last payout: ${treasuryData?.lastPayoutDaysAgo} days ago` : 'No recent payouts'}
								</div>
							</div>

							<div className='flex gap-2 pt-2'>
								<Button
									variant='bordered'
									className='flex-1'
									startContent={<Calendar className='h-4 w-4' />}
									as={LinkWithNetwork}
									// todo: add external link
									href='#'
								>
									View Cycle
								</Button>
							</div>

							<div className='space-y-1 border-t border-primary_border pt-2 text-xs text-text_secondary'>
								<div className='flex justify-between'>
									<span>Next payout:</span>
									<span>{treasuryData?.nextPayoutDays || 0} days</span>
								</div>
								{isFellow && userSalary !== '0' && (
									<div className='flex justify-between'>
										<span>Estimated amount:</span>
										<span>{formatSalary(userSalary)}</span>
									</div>
								)}
							</div>
						</>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
