// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table';
import { IPreimageResponse } from '@/global/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import { Tooltip } from '@nextui-org/tooltip';
import { Button } from '@nextui-org/button';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import formatBnBalance from '@/utils/formatBnBalance';
import PreimageCard from './PreImageCard';
import UnnoteButton from './UnnoteButton';
import LinkWithNetwork from '../Misc/LinkWithNetwork';
import Address from '../Profile/Address';

interface Props {
	className?: string;
	preimages: IPreimageResponse[];
}

function PreimagesTable({ className, preimages }: Props) {
	const { network, api, apiReady } = useApiContext();
	const { addresses } = useUserDetailsContext();

	const router = useRouter();

	const substrateAddresses = addresses?.map((address) => {
		return getSubstrateAddress(address);
	});

	return (
		<>
			<Table
				className={`${className} hidden h-[calc(100vh-200px)] overflow-y-auto md:table [&>div]:bg-cardBg`}
				aria-label='Preimages Table'
				selectionMode='single'
				isHeaderSticky
				classNames={{
					tbody: 'divide-y divide-primary_border border-t border-primary_border'
				}}
			>
				<TableHeader>
					<TableColumn>Hash</TableColumn>
					<TableColumn>Author</TableColumn>
					<TableColumn>Deposit</TableColumn>
					<TableColumn>Arguments</TableColumn>
					<TableColumn>Size</TableColumn>
					<TableColumn>Status</TableColumn>
				</TableHeader>

				<TableBody>
					{preimages.map((preimage) => (
						<TableRow
							key={preimage.id}
							as={LinkWithNetwork}
							href={`/preimages/${preimage.id}`}
							className='cursor-pointer'
						>
							<TableCell>
								<div className='flex items-center space-x-[6px]'>
									<span className='font-medium'>{`${preimage?.hash?.substring(0, 6)}...${preimage?.hash?.substring(preimage.hash.length - 6)}`}</span>
									<Tooltip content='Copy'>
										<Image
											alt='content copy icon'
											src='/icons/content_copy.svg'
											width={16}
											height={16}
											className='cursor-pointer rounded-full dark:dark-icon-filter'
											onClick={() => {
												navigator.clipboard.writeText(preimage?.hash);
											}}
										/>
									</Tooltip>
									<Tooltip content='Subscan'>
										<Button
											isIconOnly
											variant='light'
											size='sm'
											className='cursor-pointer'
											onClick={() => window.open(`https://${network}.subscan.io/extrinsic/${preimage?.statusHistory?.extrinsicIndex}`, '_blank')}
										>
											<Image
												alt='subscan icon'
												src='/parachain-logos/subscan-logo.svg'
												width={16}
												height={16}
												className='dark:dark-icon-filter'
											/>
										</Button>
									</Tooltip>
								</div>
							</TableCell>

							<TableCell>
								<div className='text-xs'>
									<Address
										variant='inline'
										address={preimage.proposer}
										truncateCharLen={4}
									/>
								</div>
							</TableCell>
							<TableCell className='font-semibold'>
								<span className='whitespace-pre font-medium'>{preimage?.deposit && formatBnBalance(preimage?.deposit, { numberAfterComma: 2, withUnit: true }, network)}</span>
							</TableCell>
							<TableCell className='font-semibold'>
								{preimage?.proposedCall && preimage?.proposedCall.section && preimage?.proposedCall.method && (
									<div className='flex items-center'>
										<code className='rounded-md bg-searchBg px-2'>
											{preimage?.proposedCall.section}.{preimage?.proposedCall.method}
										</code>
									</div>
								)}
							</TableCell>
							<TableCell className='font-semibold'>
								<span className='font-medium'>{preimage?.length}</span>
							</TableCell>
							<TableCell className='font-semibold'>
								<div className='flex items-center justify-start space-x-4'>
									<span className='font-medium'>{preimage?.status}</span>
									{preimage?.status === 'Noted' && (
										<UnnoteButton
											proposer={preimage?.proposer}
											hash={preimage?.hash}
											api={api}
											apiReady={apiReady}
											network={network}
											substrateAddresses={substrateAddresses}
											afterUnnotePreimage={() => router.refresh()}
										/>
									)}
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* Table Mobile */}
			<Table
				removeWrapper
				hideHeader
				aria-label='Preimages Table'
				className='mb-16 mt-2 table md:hidden'
				classNames={{
					td: 'px-0'
				}}
			>
				<TableHeader>
					<TableColumn>Member</TableColumn>
				</TableHeader>
				<TableBody>
					{preimages.map((preimage) => (
						<TableRow
							key={preimage.id}
							as={LinkWithNetwork}
							href={`/preimages/${preimage.id}`}
							className='cursor-pointer'
						>
							<TableCell>
								<PreimageCard preimage={preimage} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}

export default PreimagesTable;
