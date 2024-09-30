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
import PreimagesTable from '@/components/Preimage/PreImagesTable';
import PreimagePagination from '@/components/Preimage/Pagination';

type SearchParamProps = {
	page?: string;
	network?: string;
	hash?: string;
};

export const metadata: Metadata = {
	title: 'Fellowship | Preimages',
	description: 'Fellowship never felt so good before. - Preimages'
};

export default async function PreimagesPage({ searchParams }: ServerComponentProps<unknown, SearchParamProps>) {
	const { page = 1, network, hash } = searchParams ?? {};

	const headersList = headers();
	const originUrl = getOriginUrl(headersList);

	const { count, preimages } = await getPreimages({ originUrl, page: parseInt(page as string, 10), network: network as Network, hash });

	return (
		<>
			<div className='mb-2 flex flex-col  items-start justify-between gap-5 md:flex-row md:items-center'>
				<h1 className='mx-2 text-2xl font-semibold leading-9'>
					{count} {count > 1 ? 'Preimages' : 'Preimage'}
				</h1>
				<SearchPreimageHash />
			</div>

			<PreimagesTable
				preimages={preimages}
				className='mt-5'
			/>
			<div className='mt-6 flex justify-end'>
				<PreimagePagination
					totalCount={count}
					page={Number(page)}
				/>
			</div>
		</>
	);
}
