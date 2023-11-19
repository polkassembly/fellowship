// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import AddressDropdown from '@/components/Auth/AddressDropdown';
import WalletButtonsRow from '@/components/Auth/WalletButtonsRow';
import AlertCard from '@/components/Misc/AlertCard';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import { EVoteDecisionType, Wallet } from '@/global/types';
import getAllFellowAddresses from '@/utils/getAllFellowAddresses';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import React, { useEffect, useState } from 'react';

interface Props {
	defaultVoteType?: EVoteDecisionType;
}

function VoteForm({ defaultVoteType }: Props) {
	const { loginWallet } = useUserDetailsContext();
	const { api, apiReady } = useApiContext();

	const [loading, setLoading] = useState(false);
	const [fellowAddresses, setFellowAddresses] = useState<string[]>([]);
	const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(loginWallet);
	const [selectedAddress, setSelectedAddress] = useState<InjectedAccount | null>(null);

	const onWalletClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, wallet: Wallet) => {
		setSelectedWallet(wallet);
	};

	useEffect(() => {
		if (!api || !apiReady || fellowAddresses.length) return;

		(async () => {
			setLoading(true);
			const fellows = await getAllFellowAddresses(api);
			setFellowAddresses(fellows);
			setLoading(false);
		})();
	}, [api, apiReady, fellowAddresses.length]);

	return (
		<section className='flex flex-col gap-6'>
			<div className='flex flex-col items-center justify-center gap-2 text-center text-xs'>
				<h3>Please select a wallet : </h3>
				<WalletButtonsRow
					disabled={loading}
					onWalletClick={onWalletClick}
				/>
			</div>

			{selectedWallet && (
				<div className='flex flex-col gap-3'>
					{selectedAddress?.address && !fellowAddresses.includes(getSubstrateAddress(selectedAddress.address) ?? '') && (
						<AlertCard
							type='warning'
							message='This address is not a fellow. Please select a fellow address.'
						/>
					)}

					<AddressDropdown
						disabled={loading}
						wallet={selectedWallet}
						onAddressSelect={setSelectedAddress}
					/>

					<div className='flex flex-col'>{defaultVoteType}</div>
				</div>
			)}
		</section>
	);
}

export default VoteForm;
