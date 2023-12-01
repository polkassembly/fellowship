// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import getProfile from '@/app/api/v1/address/[address]/getProfile';
import Profile from '@/components/Profile';
import { Network, ServerComponentProps } from '@/global/types';
import getOriginUrl from '@/utils/getOriginUrl';
import { headers } from 'next/headers';
import React from 'react';

interface IParams {
	address: string;
}

type SearchParamProps = {
	network?: string;
};

async function ProfilePage({ params, searchParams }: ServerComponentProps<IParams, SearchParamProps>) {
	const { network } = searchParams ?? {};

	const address = params?.address;
	if (!address) return <div>Address not found</div>;

	const headersList = headers();
	const originUrl = getOriginUrl(headersList);

	const profile = await getProfile({ address, originUrl, network: network as Network });

	return (
		<Profile
			profile={{
				...profile,
				address: profile.address || address || ''
			}}
		/>
	);
}

export default ProfilePage;
