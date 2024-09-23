// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import getEncodedAddress from '@/utils/getEncodedAddress';
import { useApiContext } from '@/contexts';
import { IFellow, IFellowDataResponse } from '@/global/types';
import RANK_CONSTANTS from '@/global/constants/rankConstants';
import Image from 'next/image';
import formatSalary from '@/utils/formatSalary';
import LinkWithNetwork from '../Misc/LinkWithNetwork';
import Address from '../Profile/Address';

interface IMemberCardProps {
	className?: string;
	fellow: IFellow;
	fellowDetails?: IFellowDataResponse;
}
function MemberCard({ className, fellow, fellowDetails }: IMemberCardProps) {
	const { network } = useApiContext();
	return (
		<LinkWithNetwork
			href={`/address/${fellow.address}`}
			className={`flex w-full flex-col gap-5 rounded-lg bg-cardBg p-2.5 ${className}`}
		>
			<div className='flex w-full items-center gap-2'>
				<Address
					variant='dropdownItem'
					address={getEncodedAddress(fellow?.address || '', network) || ''}
					truncateCharLen={6}
				/>
				<Image
					alt='icon'
					src={RANK_CONSTANTS[fellow.rank].icon}
					width={20}
					height={15}
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
			</div>
			<div className='flex w-full items-center justify-between gap-5'>
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

				<div className='flex items-center gap-1 font-semibold'>
					<Image
						alt='Login Icon'
						src='/icons/table/salary.svg'
						width={20}
						height={20}
						className='dark:grayscale dark:invert'
					/>
					<span className='-mb-0.5'>{formatSalary(`${fellow.salary}`)}</span>
				</div>
			</div>
		</LinkWithNetwork>
	);
}

export default MemberCard;
