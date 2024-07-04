// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table';
import { IFellow, IFellowDataResponse } from '@/global/types';
import Image from 'next/image';
import RANK_CONSTANTS from '@/global/constants/rankConstants';
import { useApiContext } from '@/contexts';
import getEncodedAddress from '@/utils/getEncodedAddress';
import { Tooltip } from '@nextui-org/tooltip';
import Address from '../Profile/Address';
import LinkWithNetwork from '../Misc/LinkWithNetwork';
import MemberCard from './MemberCard';

interface Props {
	className?: string;
	fellows: IFellow[];
	fellowsDetails?: IFellowDataResponse;
}

function FellowsTable({ className, fellows, fellowsDetails }: Props) {
	const { network } = useApiContext();
	return (
		<>
			<Table
				className={`${className} hidden h-[calc(100vh-200px)] overflow-y-auto md:table`}
				aria-label='Fellows Table'
				selectionMode='single'
				isHeaderSticky
			>
				<TableHeader>
					<TableColumn>Members</TableColumn>
					<TableColumn>Class</TableColumn>
					{/* <TableColumn>Since</TableColumn> */}
					<TableColumn>
						<div className='flex items-center'>
							<Image
								alt='Login Icon'
								src='/icons/table/proposal.svg'
								width={16}
								height={16}
								className='ml-[-8px] mr-2'
							/>{' '}
							Proposals
						</div>
					</TableColumn>
					<TableColumn>
						<div className='flex items-center'>
							<Image
								alt='Login Icon'
								src='/icons/table/votes.svg'
								width={16}
								height={16}
								className='ml-[-8px] mr-2'
							/>{' '}
							Voted
						</div>
					</TableColumn>
					<TableColumn>
						<div className='flex items-center'>
							<Image
								alt='Login Icon'
								src='/icons/table/contribution.svg'
								width={16}
								height={16}
								className='ml-[-8px] mr-2'
							/>{' '}
							Contributions
						</div>
					</TableColumn>
					<TableColumn>
						<div className='flex items-center'>
							<Image
								alt='Login Icon'
								src='/icons/table/salary.svg'
								width={16}
								height={16}
								className='ml-[-8px] mr-2'
							/>{' '}
							Salary
						</div>
					</TableColumn>
					<TableColumn>&nbsp;</TableColumn>
				</TableHeader>

				<TableBody>
					{fellows.map((fellow) => (
						<TableRow
							key={fellow.address}
							as={LinkWithNetwork}
							href={`/address/${fellow.address}?network=${network}`}
							className='cursor-pointer'
						>
							<TableCell>
								<Address
									variant='dropdownItem'
									address={getEncodedAddress(fellow?.address || '', network) || ''}
									truncateCharLen={6}
								/>
							</TableCell>

							<TableCell>
								<div className='text-xs'>
									<Tooltip content={`Rank: ${String(RANK_CONSTANTS[fellow.rank].rank)}`}>
										<div className='flex gap-2'>
											{RANK_CONSTANTS[fellow.rank].displayName}
											<Image
												alt='rank icon'
												src={RANK_CONSTANTS[fellow.rank].icon}
												width={24}
												height={24}
											/>
										</div>
									</Tooltip>
								</div>
							</TableCell>

							{/* TODO: Add since */}
							{/* <TableCell>
							<div className='flex items-center whitespace-nowrap text-xs'>
								<Image
									alt='icon'
									src='/icons/clock.svg'
									width={12}
									height={12}
								/>
								&nbsp;Since 26th Jul 23
							</div>
						</TableCell> */}

							<TableCell className='font-semibold'>{fellowsDetails?.[fellow.address].proposalsCreated ?? '-'}</TableCell>
							<TableCell className='font-semibold'>{fellowsDetails?.[fellow.address].proposalsVotedOn ?? '-'}</TableCell>
							<TableCell className='font-semibold'>-</TableCell>
							<TableCell className='font-semibold'>{(Math.ceil(parseInt(fellow.salary as string, 10) / 6) ?? '-').toLocaleString()} USDT</TableCell>
							<TableCell>
								<Image
									alt='icon'
									src='/icons/chevron.svg'
									width={12}
									height={12}
									className='-rotate-90'
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* Table Mobile */}
			<Table
				removeWrapper
				hideHeader
				aria-label='Fellows Table'
				className='mb-16 mt-2 table md:hidden'
				classNames={{
					td: 'px-0'
				}}
			>
				<TableHeader>
					<TableColumn>Member</TableColumn>
				</TableHeader>
				<TableBody>
					{fellows.map((fellow) => (
						<TableRow
							key={fellow.address}
							as={LinkWithNetwork}
							href={`/address/${fellow.address}?network=${network}`}
							className='cursor-pointer'
						>
							<TableCell>
								<MemberCard
									fellow={fellow}
									fellowDetails={fellowsDetails}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}

export default FellowsTable;
