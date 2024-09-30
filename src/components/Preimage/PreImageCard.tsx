// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import { IPreimageResponse } from '@/global/types';
import Image from 'next/image';
import { Tooltip } from '@nextui-org/tooltip';
import { Button } from '@nextui-org/button';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import formatBnBalance from '@/utils/formatBnBalance';
import UnnoteButton from './UnnoteButton';
import Address from '../Profile/Address';

interface IPreimageCardProps {
	className?: string;
	preimage: IPreimageResponse;
	setPreimages: React.Dispatch<React.SetStateAction<IPreimageResponse[]>>;
}
function PreimageCard({ className, preimage, setPreimages }: IPreimageCardProps) {
	const { network, api, apiReady } = useApiContext();
	const { addresses } = useUserDetailsContext();

	const substrateAddresses = addresses?.map((address) => {
		return getSubstrateAddress(address);
	});

	return (
		<div className={`flex w-full justify-between gap-5 rounded-lg bg-cardBg p-2.5 ${className}`}>
			<div className='flex flex-col gap-5 font-semibold'>
				<span>Hash</span>
				<span>Author</span>
				<span>Deposit</span>
				<span>Arguments</span>
				<span>Size</span>
				<span>Status</span>
			</div>
			<div className='flex flex-col gap-5'>
				<div>
					<div className='flex items-center space-x-[6px]'>
						<span className='font-medium'>{`${preimage.hash.substring(0, 6)}...${preimage.hash.substring(preimage.hash.length - 6)}`}</span>
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
				</div>

				<div>
					<div className='text-xs'>
						<Address
							variant='inline'
							address={preimage.proposer}
							truncateCharLen={4}
						/>
					</div>
				</div>
				<div className='font-semibold'>
					<span className='whitespace-pre font-medium'>{preimage?.deposit && formatBnBalance(preimage?.deposit, { numberAfterComma: 2, withUnit: true }, network)}</span>
				</div>
				<div className='font-semibold'>
					{preimage?.proposedCall && preimage?.proposedCall.section && preimage?.proposedCall.method && (
						<div className='flex items-center'>
							<code className='rounded-md bg-searchBg px-2'>
								{preimage?.proposedCall.section}.{preimage?.proposedCall.method}
							</code>
						</div>
					)}
				</div>
				<div className='font-semibold'>
					<span className='font-medium'>{preimage?.length}</span>
				</div>
				<div className='font-semibold'>
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
								afterUnnotePreimage={() => {
									setPreimages((prev) => {
										return prev.filter((preimg: IPreimageResponse) => preimg.hash !== preimg?.hash && preimg.proposer !== preimg?.proposer);
									});
								}}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default PreimageCard;
