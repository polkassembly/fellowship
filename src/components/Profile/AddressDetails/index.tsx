// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useMemo, useState } from 'react';
import Identicon from '@polkadot/react-identicon';
import { useApiContext } from '@/contexts';
import RANK_CONSTANTS from '@/global/constants/rankConstants';
import Image from 'next/image';
import midTruncateText from '@/utils/midTruncateText';
import { Button } from '@nextui-org/button';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/dropdown';

interface Props {
	address: string;
}

function ProfileAddressDetails(props: Props) {
	const { address } = props;
	const { fellows } = useApiContext();
	const [state, setState] = useState('Active');

	const fellow = useMemo(() => {
		return fellows.find((f) => f.address === address);
	}, [address, fellows]);

	const states = [
		{
			key: 'Active',
			name: 'Active'
		},
		{
			key: 'Inactive',
			name: 'Inactive'
		}
	];

	return (
		<div className='relative flex h-[68px] min-w-[324px] gap-x-3 rounded-[20px] border border-primary_border bg-white'>
			<section className='relative h-full w-[98px]'>
				<div className='absolute -left-2 -top-3 flex h-[98px] items-center justify-center rounded-full bg-white'>
					<Identicon
						className='image identicon'
						value={address}
						size={89}
						theme='polkadot'
					/>
				</div>
			</section>
			<section className='flex w-full flex-col justify-between py-2 pl-3 pr-4'>
				<article className='flex w-full items-center justify-between'>
					<h6 className='text-xl font-semibold leading-6'>Untitled</h6>
					{fellow ? (
						<Image
							alt='rank icon'
							src={RANK_CONSTANTS[fellow?.rank].icon}
							width={24}
							height={24}
						/>
					) : null}
				</article>
				<article className='flex items-center justify-between'>
					<div className='flex items-center gap-x-1'>
						<p className='text-xs text-gray-500'>
							{midTruncateText({
								text: address,
								startChars: 5,
								endChars: 5
							})}
						</p>
						<Image
							alt='content copy icon'
							src='/icons/content_copy.svg'
							width={16}
							height={16}
							className='cursor-pointer rounded-full'
							onClick={() => {
								navigator.clipboard.writeText(address);
							}}
						/>
					</div>
					<div>
						<Dropdown>
							<DropdownTrigger>
								<Button
									variant='solid'
									className='flex h-auto items-center justify-between border-none bg-primary p-0 px-2 py-0.5 text-white'
								>
									<span className='text-xs font-normal leading-[18px] tracking-[0.33px]'>{state}</span>
									<Image
										alt='down chevron'
										src='/icons/chevron-white.svg'
										width={12}
										height={12}
										className='rounded-full'
									/>
								</Button>
							</DropdownTrigger>

							<DropdownMenu
								variant='bordered'
								aria-label='Network selection dropdown'
								onAction={(key) => {
									setState(key as string);
								}}
							>
								{states.map((s) => (
									<DropdownItem key={s.key}>{s.name}</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
					</div>
				</article>
			</section>
		</div>
	);
}

export default ProfileAddressDetails;
