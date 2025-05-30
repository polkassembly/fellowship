// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Identicon from '@polkadot/react-identicon';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import RANK_CONSTANTS from '@/global/constants/rankConstants';
import Image from 'next/image';
import midTruncateText from '@/utils/midTruncateText';
import { Button } from '@nextui-org/button';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/dropdown';
import getEncodedAddress from '@/utils/getEncodedAddress';
import { Card } from '@nextui-org/card';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import Rank from '@/components/Members/Rank';
import ActivityStatusModal from './ActivityStatusModal';
import IdentityBadge from '../Address/IdentityBadge';
import { useIdentity } from '@/hooks/useIdentity';

interface Props {
	address: string;
}

enum ActiveStatus {
	ACTIVE = 'Active',
	INACTIVE = 'Inactive'
}

const activeStates = [
	{
		key: ActiveStatus.ACTIVE,
		name: 'Active'
	},
	{
		key: ActiveStatus.INACTIVE,
		name: 'Inactive'
	}
];

function ProfileAddressDetails(props: Props) {
	const { address } = props;
	const { fellows, network, api, apiReady } = useApiContext();
	const { loginAddress } = useUserDetailsContext();
	const [activeStatus, setActiveStatus] = useState<ActiveStatus | null>(null);
	const [isActiveFormModalOpen, setIsActiveFormModalOpen] = useState(false);
	const [statusToSet, setStatusToSet] = useState<ActiveStatus>(ActiveStatus.ACTIVE);

	const { identity: onChainIdentity } = useIdentity(address);

	const substrateAddress = getSubstrateAddress(address);
	const substrateLoginAddress = getSubstrateAddress(loginAddress);
	const encodedAddress = getEncodedAddress(address, network) || address;
	const onChainUsername = onChainIdentity?.displayParent || onChainIdentity?.display || '';

	const fellow = useMemo(() => {
		return fellows.find((f) => f.address === address);
	}, [address, fellows]);

	const handleActiveStatusChange = (value: ActiveStatus) => {
		if (value === activeStatus) return;
		setIsActiveFormModalOpen(true);
		setStatusToSet(value);
	};

	useEffect(() => {
		if (!api || !apiReady || !substrateAddress || !fellow) return;

		(async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const { isActive = false } = ((await api.query.fellowshipCore.member(substrateAddress)).toJSON() || {}) as any;

			setActiveStatus(isActive ? ActiveStatus.ACTIVE : ActiveStatus.INACTIVE);
		})();
	}, [api, apiReady, address, fellow]);

	return (
		<>
			<div className='relative w-full md:w-auto'>
				<section className='relative h-full w-full xl:mb-auto xl:w-[98px]'>
					<Card className='-top-5 z-10 mx-auto flex h-[98px] w-[98px] items-center justify-center rounded-full bg-cardBg xl:absolute xl:-left-2 xl:-top-3'>
						<Identicon
							className='image identicon'
							value={address}
							size={89}
							theme='polkadot'
						/>
					</Card>
				</section>
				{/* TODO: make and use a 'profile' variant of Address/index.tsx instead */}
				<Card className='relative flex h-[68px] min-w-[324px] gap-x-3 rounded-[20px] border border-primary_border bg-cardBg pl-4 xl:pl-[98px]'>
					<section className='flex w-full flex-col justify-between py-2 pr-4'>
						<article className='flex w-full items-center justify-between'>
							<h6 className='flex items-center gap-2 text-xl font-semibold leading-6'>
								{onChainUsername ||
									midTruncateText({
										text: encodedAddress,
										startChars: 5,
										endChars: 5
									})}
								<IdentityBadge
									onChainIdentity={onChainIdentity}
									iconSize={20}
								/>
							</h6>
							{fellow ? (
								<>
									<Rank rank={fellow?.rank} />
									<Image
										alt='rank icon'
										src={RANK_CONSTANTS[fellow?.rank].icon}
										width={24}
										height={24}
									/>
								</>
							) : null}
						</article>
						<article className='flex items-center justify-between'>
							<div className='flex items-center gap-x-1'>
								<p className='text-xs text-gray-500'>
									{midTruncateText({
										text: encodedAddress,
										startChars: 5,
										endChars: 5
									})}
								</p>
								<Image
									alt='content copy icon'
									src='/icons/content_copy.svg'
									width={16}
									height={16}
									className='cursor-pointer rounded-full dark:dark-icon-filter'
									onClick={() => {
										navigator.clipboard.writeText(address);
									}}
								/>
							</div>
							<div>
								{activeStatus !== null && substrateLoginAddress === substrateAddress && (
									<Dropdown>
										<DropdownTrigger>
											<Button
												variant='solid'
												className='flex h-auto items-center justify-between border-none bg-primary_accent p-0 px-2 py-0.5 text-white'
											>
												<span className='text-xs font-normal leading-[18px] tracking-[0.33px]'>{activeStatus}</span>
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
											onAction={(key) => handleActiveStatusChange(key as ActiveStatus)}
										>
											{activeStates.map((s) => (
												<DropdownItem key={s.key}>{s.name}</DropdownItem>
											))}
										</DropdownMenu>
									</Dropdown>
								)}
							</div>
						</article>
					</section>
				</Card>
			</div>

			<ActivityStatusModal
				isOpen={activeStatus !== null && isActiveFormModalOpen}
				onClose={() => setIsActiveFormModalOpen(false)}
				address={address}
				isActive={statusToSet === ActiveStatus.ACTIVE}
				onSuccess={(isActive) => {
					setActiveStatus(isActive ? ActiveStatus.ACTIVE : ActiveStatus.INACTIVE);
					setIsActiveFormModalOpen(false);
				}}
			/>
		</>
	);
}

export default ProfileAddressDetails;
