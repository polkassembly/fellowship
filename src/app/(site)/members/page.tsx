// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import { useApiContext } from '@/contexts';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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

			<div className='mt-9 flex w-full gap-3 overflow-x-scroll scrollbar-hide'>
				<Chip
					onClick={() => setSelectedRankGroup(null)}
					color={!selectedRankGroup ? 'primary' : 'default'}
					variant='bordered'
					className='min-h-10 h-10 max-h-10 cursor-pointer rounded-xl border-1'
				>
					<span className='text-xs font-semibold'>All ({fellows.length})</span>
				</Chip>

				{Object.values(RANK_GROUP).map((rankGroup) => (
					<Chip
						color={selectedRankGroup === rankGroup ? 'primary' : 'default'}
						key={rankGroup}
						variant='bordered'
						className='min-h-10 h-10 max-h-10 cursor-pointer gap-1 rounded-xl border-1 px-6'
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

			<FellowsTable
				className='my-4'
				fellows={filteredFellows}
				fellowsDetails={fellowsDetails}
			/>
		</div>
	);
}

export default MembersPage;
