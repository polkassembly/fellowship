// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useEffect, useState } from 'react';
import { UserPlus, TrendingUp, FileText, Vote, CircleCheckBig, DollarSign, TrendingDown, Settings } from 'lucide-react';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { ActivityFeedItem, EActivityFeed, SubsquidActivityType } from '@/global/types';
import { useApiContext } from '@/contexts';
import LinkWithNetwork from '../../Misc/LinkWithNetwork';
import getActivityFeed from '@/app/api/v1/feed/getActivityFeed';
import getOriginUrl from '@/utils/getOriginUrl';
import dayjs from '@/services/dayjs-init';
import LoadingSpinner from '../../Misc/LoadingSpinner';
import Address from '../../Profile/Address';

// Simple function to get activity details
const getActivityDetails = (feedItem: ActivityFeedItem) => {
	switch (feedItem.type) {
		case SubsquidActivityType.Inducted:
			return { icon: UserPlus, color: 'text-green-600', title: 'Member Inducted', description: 'was inducted into the fellowship' };
		case SubsquidActivityType.Promoted:
			return { icon: TrendingUp, color: 'text-green-600', title: 'Member Promoted', description: `was promoted to Rank ${feedItem.rank || 0}` };
		case SubsquidActivityType.Demoted:
			return { icon: TrendingDown, color: 'text-red-600', title: 'Member Demoted', description: `was demoted to Rank ${feedItem.rank || 0}` };
		case SubsquidActivityType.Retained:
			return { icon: CircleCheckBig, color: 'text-green-600', title: 'Member Retained', description: `was retained at Rank ${feedItem.rank || 0}` };
		case SubsquidActivityType.EvidenceSubmitted:
			return { icon: FileText, color: 'text-purple-600', title: 'Evidence Submitted', description: 'submitted new evidence' };
		case SubsquidActivityType.GeneralProposal:
		case SubsquidActivityType.RFC:
			return { icon: Vote, color: 'text-blue-600', title: 'Proposal Created', description: 'created a new proposal' };
		case SubsquidActivityType.Payout:
			return { icon: DollarSign, color: 'text-yellow-600', title: 'Salary Payout', description: 'received salary payout' };
		case SubsquidActivityType.Voted:
			return {
				icon: Vote,
				color: 'text-blue-600',
				title: 'Vote Cast',
				description: `voted ${feedItem.vote?.decision || 'unknown'} on proposal #${feedItem.vote?.proposalIndex || 'unknown'}`
			};
		case SubsquidActivityType.OffBoarded:
			return { icon: TrendingDown, color: 'text-red-600', title: 'Member Off-boarded', description: 'was off-boarded from the fellowship' };
		case SubsquidActivityType.ActivityChanged:
			return { icon: Settings, color: 'text-gray-600', title: 'Status Changed', description: `status changed to ${feedItem.isActive ? 'active' : 'inactive'}` };
		default:
			return { icon: CircleCheckBig, color: 'text-blue-600', title: 'Activity', description: 'performed an activity' };
	}
};

export default function ActivityFeed() {
	const { network } = useApiContext();
	const [feedItems, setFeedItems] = useState<ActivityFeedItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchActivities = async () => {
			try {
				setLoading(true);
				setError(null);

				const originUrl = getOriginUrl();
				const feedItems = (await getActivityFeed({
					feedType: EActivityFeed.ALL,
					originUrl,
					page: 1,
					network
				})) as ActivityFeedItem[];

				if (Array.isArray(feedItems)) {
					// Sort by created_at date first (most recent first) and limit to 5 items
					const sortedFeedItems = feedItems.toSorted((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
					setFeedItems(sortedFeedItems);
				} else {
					setFeedItems([]);
				}
			} catch (err) {
				console.error('Error fetching activities:', err);
				setError('Failed to load activities');
				setFeedItems([]);
			} finally {
				setLoading(false);
			}
		};

		fetchActivities();
	}, [network]);

	return (
		<div className='p-4'>
			<Card>
				<CardHeader>
					<div className='flex items-center justify-between'>
						<div className='font-poppins text-text_secondary'>What's Happening</div>
					</div>
				</CardHeader>
				<CardBody>
					{loading && (
						<div className='flex justify-center py-8'>
							<LoadingSpinner message='Loading activities...' />
						</div>
					)}

					{error && <div className='py-4 text-center text-sm text-text_secondary'>{error}</div>}

					{!loading && !error && (
						<div className='space-y-3'>
							{feedItems.length > 0 ? (
								feedItems.map((feedItem) => {
									const details = getActivityDetails(feedItem);
									const IconComponent = details.icon;
									const timestamp = dayjs(feedItem.created_at).fromNow();

									return (
										<div
											key={feedItem.id}
											className='flex gap-3 rounded-lg border border-primary_border bg-cardBg p-3'
										>
											<div className='mt-0.5 flex-shrink-0'>
												<IconComponent className={`h-4 w-4 ${details.color}`} />
											</div>
											<div className='min-w-0 flex-1 overflow-hidden'>
												<p className='truncate text-sm font-medium'>{details.title}</p>
												<div className='mt-1 flex flex-wrap items-center gap-1 text-xs text-text_secondary'>
													<Address
														variant='inline'
														address={feedItem.who}
														truncateCharLen={8}
														iconSize={12}
														showRank={false}
														className='text-xs'
													/>
													<span>{details.description}</span>
												</div>
												<p className='mt-1 text-xs text-text_secondary'>{timestamp}</p>
											</div>
										</div>
									);
								})
							) : (
								<div className='py-4 text-center text-sm text-text_secondary'>No recent activities found.</div>
							)}
						</div>
					)}

					<div className='mt-4 border-t border-primary_border pt-3'>
						<Button
							href='/'
							as={LinkWithNetwork}
							variant='bordered'
							className='w-full'
						>
							View All Activity
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
