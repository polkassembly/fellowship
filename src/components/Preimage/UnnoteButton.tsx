// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { Tooltip } from '@nextui-org/tooltip';
import { Button } from '@nextui-org/button';
import Image from 'next/image';
import queueNotification from '@/utils/queueNotification';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import executeTx from '@/utils/executeTx';
import LoadingSpinner from '../Misc/LoadingSpinner';

interface UnnoteButtonProps {
	proposer: string;
	hash: string;
	api?: ApiPromise;
	apiReady: boolean;
	network: string;
	substrateAddresses?: (string | null)[];
	afterUnnotePreimage: () => void;
}

export default function UnnoteButton({ proposer, hash, api, apiReady, network, substrateAddresses, afterUnnotePreimage }: UnnoteButtonProps) {
	const [loading, setLoading] = useState<boolean>(false);
	const isProposer = substrateAddresses?.includes(getSubstrateAddress(proposer) || proposer);

	if (!isProposer) return null;

	const handleSubmit = async () => {
		if (!api || !apiReady) {
			return;
		}
		setLoading(true);
		const preimageTx = api.tx.preimage.unnotePreimage(hash);

		const onSuccess = () => {
			afterUnnotePreimage();
			setLoading(false);
			queueNotification({
				header: 'Success!',
				message: 'Preimage Cleared Successfully',
				status: 'success'
			});
		};

		const onFailed = (message: string) => {
			setLoading(false);
			queueNotification({
				header: 'Failed!',
				message,
				status: 'error'
			});
		};
		if (!preimageTx) return;

		await executeTx({
			address: proposer,
			api,
			apiReady,
			errorMessageFallback: 'Transaction failed.',
			network,
			onFailed,
			onSuccess,
			tx: preimageTx
		});
	};
	return (
		<div className='flex items-center space-x-2'>
			<Tooltip
				placement='top'
				content='Unnote Preimage'
			>
				<Button
					isIconOnly
					variant='bordered'
					onClick={handleSubmit}
					size='sm'
					disabled={loading}
				>
					<Image
						alt='close icon'
						src='/icons/menu-close-icon.svg'
						width={16}
						height={16}
						className='cursor-pointer rounded-full dark:dark-icon-filter'
					/>
				</Button>
			</Tooltip>
			<div>{loading && <LoadingSpinner />}</div>
		</div>
	);
}
