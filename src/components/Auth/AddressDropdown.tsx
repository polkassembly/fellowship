// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Button, ButtonProps } from '@nextui-org/button';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/dropdown';
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Wallet } from '@/global/types';
import { InjectedAccount, InjectedWindow } from '@polkadot/extension-inject/types';
import getWalletAccounts from '@/utils/getWalletAccounts';
import { Skeleton } from '@nextui-org/skeleton';
import { useApiContext } from '@/contexts';
import APP_NAME from '@/global/constants/appName';
import { ApiPromise } from '@polkadot/api';
import AlertCard from '../Misc/AlertCard';
import Address from '../Profile/Address';

interface Props {
	disabled?: boolean;
	wallet: Wallet;
	label?: string;
	triggerVariant?: ButtonProps['variant'];
	onAddressSelect: (account: InjectedAccount) => void;
}

function AddressDropdown({ disabled, label, wallet, triggerVariant, onAddressSelect }: Props) {
	const { api, apiReady, network } = useApiContext();

	const [extensionNotFound, setExtensionNotFound] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [walletError, setWalletError] = useState('');
	const [accountsNotFound, setAccountsNotFound] = useState<boolean>(false);
	const [accounts, setAccounts] = useState<InjectedAccount[]>([]);
	const [selectedAddress, setSelectedAddress] = useState<InjectedAccount | null>(null);

	const handleSetSigner = async (apiPromise: ApiPromise) => {
		const injectedWindow = window as Window & InjectedWindow;
		const injectedWallet = injectedWindow?.injectedWeb3?.[String(wallet)];

		if (!injectedWallet) {
			setWalletError('Please select a wallet.');
			return;
		}

		const injected = injectedWallet && injectedWallet.enable && (await injectedWallet.enable(APP_NAME));
		if (!injected) {
			setWalletError('Please select a valid wallet.');
			return;
		}

		apiPromise.setSigner(injected.signer);
	};

	const handleOnAddressSelect = useCallback(
		(account: InjectedAccount) => {
			if (disabled) return;

			setSelectedAddress(account);
			onAddressSelect(account);

			if (!apiReady) {
				(async () => {
					setLoading(true);

					await api?.isReady;
					if (api) handleSetSigner(api);

					setLoading(false);
				})();
			} else if (api) handleSetSigner(api);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[onAddressSelect]
	);

	useEffect(() => {
		getWalletAccounts({
			wallet,
			network,
			setExtensionNotFound,
			setLoading,
			setWalletError,
			setAccountsNotFound,
			setAccounts,
			setSelectedAddress: handleOnAddressSelect
		});
	}, [handleOnAddressSelect, network, wallet]);

	if (extensionNotFound) {
		return <AlertCard message={`${wallet} extension not found.`} />;
	}

	if (accountsNotFound) {
		return <AlertCard message={`Accounts not found on ${wallet} extension.`} />;
	}

	if (loading) {
		return (
			<Skeleton className='rounded-lg'>
				<div className='h-12 rounded-lg bg-default-300' />
			</Skeleton>
		);
	}

	return (
		<div className='flex w-full flex-col gap-3'>
			{walletError && <AlertCard message={walletError} />}

			<div className='flex w-full flex-col gap-1'>
				{label && <small className='text-xs text-foreground/60'>{label}</small>}

				<Dropdown
					isDisabled={disabled}
					className='w-full'
				>
					<DropdownTrigger
						disabled={disabled}
						className='w-full'
					>
						<Button
							variant={triggerVariant || 'bordered'}
							className='flex items-center justify-between border-1 py-6'
							disabled={disabled}
						>
							<span>
								{selectedAddress ? (
									<Address
										variant='dropdownItem'
										name={selectedAddress.name || ''}
										address={selectedAddress.address}
									/>
								) : (
									'Select Address'
								)}
							</span>
							<span>
								<Image
									alt='down chevron'
									src='/icons/chevron.svg'
									width={12}
									height={12}
									className='rounded-full'
								/>
							</span>
						</Button>
					</DropdownTrigger>

					<DropdownMenu
						aria-label='Addresses'
						className='max-h-[30vh] w-[480px] overflow-y-scroll text-sm'
					>
						{accounts.map((account) => (
							<DropdownItem
								key={account.address}
								textValue={account.address}
								className='py-2'
								onPress={() => handleOnAddressSelect(account)}
							>
								<Address
									variant='dropdownItem'
									name={account.name || 'Untitled'}
									address={account.address}
								/>
							</DropdownItem>
						))}
					</DropdownMenu>
				</Dropdown>
			</div>
		</div>
	);
}

export default AddressDropdown;
