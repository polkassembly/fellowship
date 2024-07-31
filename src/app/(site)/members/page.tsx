// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import { useApiContext } from '@/contexts';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Input } from '@nextui-org/input';
import TopFellowsCard from '@/components/Members/TopFellowsCard';
import RANK_CONSTANTS, { RANK_GROUP } from '@/global/constants/rankConstants';
import { Chip } from '@nextui-org/chip';
import FellowsTable from '@/components/Members/FellowsTable';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import { IFellowDataResponse } from '@/global/types';

function MembersPage() {
	const { fellows, network } = useApiContext();

	const [selectedRankGroup, setSelectedRankGroup] = useState<RANK_GROUP | null>(null);
	const [fellowsDetails, setFellowsDetails] = useState<IFellowDataResponse>();
	const [searchValue, setSearchValue] = useState<string>('');

	const getFellowsDetails = async () => {
		const { data, error: fellowError } = await nextApiClientFetch<IFellowDataResponse>({
			network,
			url: 'api/v1/fellows',
			isPolkassemblyAPI: false,
			data: {
				addresses: fellows.map((fellow) => fellow.address)
			}
		});

		if (fellowError || !data) {
			// eslint-disable-next-line no-console
			console.error('Error in fetching fellow details: ', fellowError);
			return;
		}
		setFellowsDetails(data);
	};

	useEffect(() => {
		if (!fellows?.length) return;
		getFellowsDetails();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fellows]);

	if (!fellows?.length) {
		return (
			<div className='flex h-[50vh] w-full justify-center'>
				<LoadingSpinner message='Fetching fellows ...' />
			</div>
		);
	}

	const filteredFellows = selectedRankGroup ? fellows.filter((fellow) => RANK_CONSTANTS[fellow.rank].group === selectedRankGroup) : fellows;

	// Filter the fellows based on the search value
	const searchedFellows = searchValue ? filteredFellows.filter((fellow) => fellow.address.toLowerCase().includes(searchValue.toLowerCase())) : filteredFellows;

	return (
		<div className='flex flex-col'>
			<div className='flex items-center gap-2 text-xl font-semibold'>
				<Image
					alt='icon'
					src='/icons/sidebar/users-filled-blue-gray.svg'
					width={24}
					height={24}
				/>
				<span className='flex items-baseline gap-1'>
					Members
					<span className='text-xs  font-normal'>({fellows.length})</span>
				</span>
			</div>

			<TopFellowsCard fellowsDetails={fellowsDetails} />

			<div className='mt-9 flex w-full flex-col justify-between gap-5 md:flex-row md:gap-20'>
				<div className='flex w-full gap-3 overflow-x-scroll'>
					<Chip
						onClick={() => setSelectedRankGroup(null)}
						color={!selectedRankGroup ? 'primary' : 'default'}
						variant='bordered'
						className='h-10 max-h-10 min-h-10 cursor-pointer rounded-xl border-1'
					>
						<span className='text-xs font-semibold'>All ({fellows.length})</span>
					</Chip>

					{Object.values(RANK_GROUP).map((rankGroup) => (
						<Chip
							color={selectedRankGroup === rankGroup ? 'primary' : 'default'}
							key={rankGroup}
							variant='bordered'
							className='h-10 max-h-10 min-h-10 cursor-pointer gap-1 rounded-xl border-1 px-6'
							onClick={() => setSelectedRankGroup(rankGroup)}
						>
							<div className='flex items-center gap-2'>
								<Image
									alt='rank icon'
									src={`/icons/ranks/${rankGroup.toLowerCase()}.svg`}
									width={24}
									height={24}
								/>

								<span className='text-xs font-semibold'>{rankGroup}</span>
							</div>
						</Chip>
					))}
				</div>
				<Input
					size='md'
					type='text'
					variant='bordered'
					placeholder='Search'
					startContent={
						<Image
							alt='search icon'
							src='/icons/search.svg'
							width={12}
							height={12}
						/>
					}
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					className='ml-auto w-full flex-shrink md:w-[120px]'
					classNames={{
						inputWrapper: ['border-1', 'border-primary_border']
					}}
				/>
			</div>

			<FellowsTable
				className='my-4'
				fellows={searchedFellows} // Use the searchedFellows instead of filteredFellows
				fellowsDetails={fellowsDetails}
			/>
		</div>
	);
}

export default MembersPage;
