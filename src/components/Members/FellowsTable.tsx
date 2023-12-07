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

interface Props {
	className?: string;
	fellows: IFellow[];
	fellowsDetails?: IFellowDataResponse;
}

function FellowsTable({ className, fellows, fellowsDetails }: Props) {
	const { network } = useApiContext();
	return (
		<Table
			className={`${className} h-[calc(100vh-200px)] overflow-y-auto`}
			aria-label='Fellows Table'
			selectionMode='single'
			isHeaderSticky
		>
			<TableHeader>
				<TableColumn>Members</TableColumn>
				<TableColumn>Class</TableColumn>
				{/* <TableColumn>Since</TableColumn> */}
				<TableColumn>Proposals Created</TableColumn>
				<TableColumn>Proposals Voted</TableColumn>
				<TableColumn>Github Contributions</TableColumn>
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
	);
}

export default FellowsTable;
