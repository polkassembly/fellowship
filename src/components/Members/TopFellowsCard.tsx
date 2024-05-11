// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card } from '@nextui-org/card';
import React from 'react';
import Image from 'next/image';
import { useApiContext } from '@/contexts';
import { IFellow, IFellowDataResponse } from '@/global/types';
import RANK_CONSTANTS from '@/global/constants/rankConstants';
import Address from '../Profile/Address';
import LinkWithNetwork from '../Misc/LinkWithNetwork';

interface Props {
	className?: string;
	fellowsDetails?: IFellowDataResponse;
}

function TopFellowRow({ className, fellow, fellowDetails }: { className?: string; fellow: IFellow; fellowDetails?: IFellowDataResponse }) {
	return (
		<LinkWithNetwork
			href={`/address/${fellow.address}`}
			className={`${className} flex h-[52px] w-full items-center justify-between rounded-full bg-topFellowCardBg px-6 py-[6px] text-foreground`}
		>
			<div className='w-[80px]'>
				<Address
					className='font-semibold'
					variant='dropdownItem'
					address={fellow.address}
					truncateCharLen={4}
				/>
			</div>

			<Image
				alt='icon'
				src={RANK_CONSTANTS[fellow.rank].icon}
				width={42}
				height={32}
			/>

			{/* TODO: Add since */}

			{/* <div className='flex items-center text-xs'>
				<Image
					alt='icon'
					src='/icons/clock.svg'
					width={12}
					height={12}
					className='dark:grayscale dark:invert'
				/>
				&nbsp;Since 26th Jul 23
			</div> */}

			<div className='flex items-center gap-1 font-semibold'>
				<Image
					alt='icon'
					src='/icons/proposal-voted.svg'
					width={20}
					height={20}
					className='dark:grayscale dark:invert'
				/>
				<span className='-mb-0.5'>{fellowDetails?.[fellow.address].proposalsCreated ?? '-'}</span>
			</div>

			<div className='flex items-center gap-1 font-semibold'>
				<Image
					alt='icon'
					src='/icons/sidebar/vote-outlined-dark-grey.svg'
					width={20}
					height={20}
					className='dark:grayscale dark:invert'
				/>
				<span>{fellowDetails?.[fellow.address].proposalsVotedOn ?? '-'}</span>
			</div>

			<div className='flex items-center gap-1 font-semibold'>
				<Image
					alt='icon'
					src='/icons/sidebar/git-branch-dark-grey.svg'
					width={20}
					height={20}
					className='dark:grayscale dark:invert'
				/>
				<span className='-mb-0.5'>-</span>
			</div>

			<Image
				alt='icon'
				src='/icons/chevron.svg'
				width={12}
				height={12}
				className='-rotate-90 dark:grayscale dark:invert'
			/>
		</LinkWithNetwork>
	);
}

function TopFellowsCard({ className, fellowsDetails }: Props) {
	const { fellows } = useApiContext();

	return (
		<div className={`${className} flex flex-col items-start justify-center`}>
			<div className='z-10 -mb-5 w-min self-center whitespace-nowrap rounded-xl bg-[#6B2D80] px-6 py-2 text-white'>Top Fellows</div>
			<Card
				className='flex w-full flex-col items-center gap-4 gap-y-3 border border-primary_border bg-gradient-to-r from-[#661E7F] to-[#D396CF] p-6 md:h-[230px] md:flex-row'
				shadow='none'
				radius='lg'
			>
				<Image
					alt='icon'
					src='/misc/top-member-cup.svg'
					width={170}
					height={161}
				/>

				<div className='flex h-full w-full flex-col justify-between gap-3'>
					<TopFellowRow
						fellow={fellows[0]}
						fellowDetails={fellowsDetails}
					/>
					<TopFellowRow
						fellow={fellows[1]}
						fellowDetails={fellowsDetails}
					/>
					<TopFellowRow
						fellow={fellows[2]}
						fellowDetails={fellowsDetails}
					/>
				</div>
			</Card>
		</div>
	);
}

export default TopFellowsCard;
