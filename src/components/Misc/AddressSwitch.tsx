// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Divider } from '@nextui-org/divider';
import { Wallet } from '@/global/types';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import { useUserDetailsContext, useApiContext } from '@/contexts';
import WalletButtonsRow from '@/components/Auth/WalletButtonsRow';
import AddressDropdown from '@/components/Auth/AddressDropdown';
import Address from '@/components/Profile/Address';
import { RefreshCcw } from 'lucide-react';
import getWalletAccounts from '@/utils/getWalletAccounts';
import getSubstrateAddress from '@/utils/getSubstrateAddress';

interface Props {
	readonly selectedWallet: Wallet | null;
	readonly selectedAddress: InjectedAccount | null;
	readonly onWalletChange: (wallet: Wallet) => void;
	readonly onAddressChange: (address: InjectedAccount) => void;
	readonly disabled?: boolean;
	readonly className?: string;
}

function AddressSwitch({ selectedWallet, selectedAddress, onWalletChange, onAddressChange, disabled = false, className = '' }: Props) {
	const { loginWallet, loginAddress } = useUserDetailsContext();
	const { network } = useApiContext();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [tempSelectedWallet, setTempSelectedWallet] = useState<Wallet | null>(selectedWallet);
	const [tempSelectedAddress, setTempSelectedAddress] = useState<InjectedAccount | null>(selectedAddress);
	const [isLoadingDefaults, setIsLoadingDefaults] = useState(false);

	// Find account that matches login address
	const findMatchingAccount = (accounts: InjectedAccount[], targetAddress: string): InjectedAccount | null => {
		return (
			accounts.find((acc) => {
				const substrateAddr = getSubstrateAddress(acc.address);
				return substrateAddr === targetAddress || acc.address === targetAddress;
			}) || null
		);
	};

	// Set default wallet and address on mount
	useEffect(() => {
		const setDefaults = async () => {
			if (!selectedWallet && !selectedAddress && loginWallet && loginAddress) {
				setIsLoadingDefaults(true);
				try {
					let foundAccount: InjectedAccount | null = null;

					await getWalletAccounts({
						wallet: loginWallet,
						network,
						setAccounts: (accs) => {
							foundAccount = findMatchingAccount(accs, loginAddress);
						},
						setSelectedAddress: () => {} // Not needed for this use case
					});

					if (foundAccount) {
						onWalletChange(loginWallet);
						onAddressChange(foundAccount);
					}
				} catch (error) {
					console.error('Error setting default wallet/address:', error);
				} finally {
					setIsLoadingDefaults(false);
				}
			}
		};

		setDefaults();
	}, [selectedWallet, selectedAddress, loginWallet, loginAddress, network, onWalletChange, onAddressChange]);

	const handleSwitchClick = () => {
		setTempSelectedWallet(selectedWallet);
		setTempSelectedAddress(selectedAddress);
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		// Reset temp selections to current selections
		setTempSelectedWallet(selectedWallet);
		setTempSelectedAddress(selectedAddress);
	};

	const handleConfirm = () => {
		if (tempSelectedWallet && tempSelectedAddress) {
			onWalletChange(tempSelectedWallet);
			onAddressChange(tempSelectedAddress);
		}
		setIsModalOpen(false);
	};

	const canConfirm = tempSelectedWallet && tempSelectedAddress;

	const renderAddressContent = () => {
		if (isLoadingDefaults) {
			return <span className='text-sm text-text_secondary'>Loading...</span>;
		}

		if (selectedWallet && selectedAddress) {
			return (
				<div className='flex items-center gap-2'>
					<Address
						address={selectedAddress.address}
						variant='inline'
						className='text-sm'
					/>
				</div>
			);
		}

		return <span className='text-sm text-text_secondary'>No wallet selected</span>;
	};

	return (
		<>
			<div className={`flex items-center justify-between rounded-lg border border-primary_border p-3 ${className}`}>
				<div className='flex items-center gap-3'>
					<div className='flex flex-col'>
						<span className='text-xs text-text_secondary'>Selected Address</span>
						{renderAddressContent()}
					</div>
				</div>
				<Button
					size='sm'
					variant='light'
					onPress={handleSwitchClick}
					disabled={disabled}
					startContent={<RefreshCcw className='h-4 w-4' />}
					className='bg-primary_accent text-white hover:bg-primary_accent/80 hover:text-text_secondary'
				>
					Switch
				</Button>
			</div>

			<Modal
				isOpen={isModalOpen}
				onClose={handleModalClose}
				size='lg'
				scrollBehavior='inside'
				shouldBlockScroll
				className='bg-cardBg'
			>
				<ModalContent>
					{() => (
						<>
							<ModalHeader className='flex items-center gap-2 text-sm'>
								<RefreshCcw className='h-5 w-5' />
								<h3 className='font-semibold'>Switch Wallet & Address</h3>
							</ModalHeader>
							<Divider />

							<ModalBody className='space-y-6'>
								<div>
									<h4 className='mb-3 text-sm font-medium'>Select Wallet</h4>
									<WalletButtonsRow
										disabled={disabled}
										onWalletClick={(e: React.MouseEvent, wallet: Wallet) => setTempSelectedWallet(wallet)}
									/>
								</div>

								{tempSelectedWallet && (
									<div>
										<h4 className='mb-3 text-sm font-medium'>Select Address</h4>
										<AddressDropdown
											wallet={tempSelectedWallet}
											onAddressSelect={setTempSelectedAddress}
											disabled={disabled}
										/>
									</div>
								)}
							</ModalBody>

							<Divider />

							<ModalFooter>
								<Button
									variant='light'
									onPress={handleModalClose}
									className='text-text_secondary'
								>
									Cancel
								</Button>
								<Button
									color='primary'
									onPress={handleConfirm}
									disabled={!canConfirm || disabled}
									className='bg-primary_accent'
								>
									Confirm Selection
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}

export default AddressSwitch;
