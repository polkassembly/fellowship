// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import ActivityFeed from '@/components/Home/ActivityFeed';
import ActivitySelectorCard from '@/components/Home/ActivitySelectorCard';
import Carousel from '@/components/Home/Carousel';
import Stats from '@/components/Home/Stats';
import PostFeed from '@/components/Home/PostFeed';
import Profile from '@/components/Profile';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import { ActivityFeedItem, EActivityFeed, IProfile, Network } from '@/global/types';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import getProfile from './api/v1/address/[address]/getProfile';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';

interface Props {
	feedItems: ActivityFeedItem[] | any[];
	feed: EActivityFeed;
	network: Network;
	originUrl: string;
}

export default function HomeClientWrapper({ feedItems, feed, network, originUrl }: Props) {
	const { fellows } = useApiContext();
	const { loginAddress } = useUserDetailsContext();

	const [userProfile, setUserProfile] = useState<IProfile | null>(null);
	const [loading, setLoading] = useState(false);

	// Check if current user is a fellow
	const isFellow = useMemo(() => {
		if (!loginAddress || !fellows?.length) return false;
		const substrateAddress = getSubstrateAddress(loginAddress);
		return fellows.find((f: any) => f.address === substrateAddress) !== undefined;
	}, [loginAddress, fellows]);

	// Fetch user profile data (for fellows)
	useEffect(() => {
		if (isFellow && loginAddress) {
			const fetchUserProfile = async () => {
				try {
					setLoading(true);
					const profile = await getProfile({
						address: loginAddress,
						originUrl,
						network
					});
					setUserProfile(profile);
				} catch (error) {
					console.error('Error fetching user profile:', error);
					setUserProfile(null);
				} finally {
					setLoading(false);
				}
			};

			fetchUserProfile();
		}
	}, [isFellow, loginAddress, network, originUrl]);

	console.log('userProfile', userProfile);

	if (loading) {
		return (
			<div className='flex w-full flex-col gap-y-8'>
				<Carousel />
				<div className='flex items-center justify-center p-8'>
					<LoadingSpinner />
				</div>
			</div>
		);
	}

	// If user is a fellow, show their profile
	if (isFellow && userProfile) {
		return <Profile profile={userProfile} />;
	}

	// If user is not a fellow, show activity feed
	return (
		<div className='flex w-full flex-col gap-y-8'>
			<Carousel />

			<div className='mb-16 flex flex-col items-center gap-8 md:mb-auto lg:flex-row lg:items-start'>
				<div className='flex w-full flex-col gap-y-4'>
					<Stats className='lg:hidden' />
					<ActivitySelectorCard value={feed} />
					{feed === EActivityFeed.ALL ? <ActivityFeed items={feedItems as ActivityFeedItem[]} /> : <PostFeed items={feedItems as any[]} />}
				</div>
			</div>
		</div>
	);
}
