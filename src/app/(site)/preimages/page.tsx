// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Network, ServerComponentProps } from '@/global/types';
import React from 'react';
import { headers } from 'next/headers';
import { Metadata } from 'next';
import getOriginUrl from '@/utils/getOriginUrl';
import getPreimages from '@/app/api/v1/preimages/getPreimges';
import SearchPreimageHash from '@/components/Preimage/SearchPreimageHash';

type SearchParamProps = {
	page?: string;
	network?: string;
};

export const metadata: Metadata = {
	title: 'Fellowship | Preimages',
	description: 'Fellowship never felt so good before. - Preimages'
};

export default async function PreimagesPage({ searchParams }: ServerComponentProps<unknown, SearchParamProps>) {
	const { page = 1, network } = searchParams ?? {};

	const headersList = headers();
	const originUrl = getOriginUrl(headersList);

	const { count, preimages } = await getPreimages({ originUrl, page: parseInt(page as string, 10), network: network as Network });

	console.log(preimages, count);

	return (
		<>
			<div className='mb-2 flex items-center justify-between'>
				<h1 className='mx-2 text-2xl font-semibold leading-9'>
					{count} {count > 1 ? 'Preimages' : 'Preimage'}
				</h1>
				<div className='flex items-center justify-between gap-3'>
					<SearchPreimageHash />
				</div>
			</div>

			<div className='rounded-xxl border p-3 shadow-md'>
				<div>
					Preimage Table
					<div className='mt-6 flex justify-end'>pagintion</div>
				</div>
			</div>
		</>
	);
}
