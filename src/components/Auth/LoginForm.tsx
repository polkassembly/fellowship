// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TFA_CODE_RULES } from '@/global/validationRules';
import { IAuthResponse, TokenType, Wallet } from '@/global/types';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import { handleTokenChange } from '@/services/auth.service';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { InjectedAccount, InjectedWindow } from '@polkadot/extension-inject/types';
import APP_NAME from '@/global/constants/appName';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import { stringToHex } from '@polkadot/util';
import { SignerResult } from '@polkadot/api/types';
import { SIGN_MESSAGE } from '@/global/constants/signMessage';
import WalletButtonsRow from './WalletButtonsRow';
import AlertCard from '../Misc/AlertCard';
import AddressDropdown from './AddressDropdown';

const INPUT_LABEL_CLASSNAMES = 'text-sm font-normal';
const INPUT_WRAPPER_CLASSNAMES = 'border-primary_border border-1';

function LoginForm({ onClose }: { onClose?: () => void }) {
	const {
		register: registerTFAForm,
		formState: { errors: errorsTFAForm },
		handleSubmit: handleSubmitTFAForm
	} = useForm({
		defaultValues: {
			authCode: ''
		}
	});

	const currentUser = useUserDetailsContext();
	const router = useRouter();
	const { network } = useApiContext();

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const [authResponse, setAuthResponse] = useState<IAuthResponse | null>(null);
	const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
	const [selectedAddress, setSelectedAddress] = useState<InjectedAccount | null>(null);
	const [isSignup, setIsSignup] = useState<boolean>(false);

	const onTFASubmit = async ({ authCode }: { authCode: string }) => {
		if (isNaN(Number(authCode))) return;

		setLoading(true);
		setError('');

		const { data, error: tfaError } = await nextApiClientFetch<IAuthResponse>({
			network,
			url: 'api/v1/auth/actions/2fa/validate',
			isPolkassemblyAPI: true,
			data: {
				auth_code: String(authCode), // use string for if it starts with 0
				tfa_token: authResponse?.tfa_token,
				user_id: Number(authResponse?.user_id)
			}
		});

		if (tfaError || !data) {
			setError(tfaError || 'Login failed. Please try again later.');
			setLoading(false);
			return;
		}

		if (data?.token) {
			setError('');
			handleTokenChange(data.token, currentUser);
			router.back();
		}
	};

	const onWalletClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, wallet: Wallet) => {
		setSelectedWallet(wallet);
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const walletSignup = async (substrateAddress: string, signRaw: (raw: any) => Promise<SignerResult>) => {
		setIsSignup(true);

		try {
			setLoading(true);

			const { signature: signupSignature } = await signRaw({
				address: substrateAddress,
				data: stringToHex(SIGN_MESSAGE),
				type: 'bytes'
			});

			const { data: confirmData, error: confirmError } = await nextApiClientFetch<TokenType>({
				network,
				url: 'api/v1/auth/actions/addressSignup',
				isPolkassemblyAPI: true,
				data: {
					address: substrateAddress,
					signature: signupSignature,
					wallet: selectedWallet
				}
			});

			if (confirmError || !confirmData) throw new Error(confirmError || 'Something went wrong');

			if (!confirmData.token) throw new Error('Web3 Login failed');

			currentUser.loginWallet = selectedWallet;
			currentUser.loginAddress = substrateAddress;
			if (selectedWallet) localStorage.setItem('loginWallet', selectedWallet);
			localStorage.setItem('loginAddress', substrateAddress);

			handleTokenChange(confirmData.token, currentUser);

			onClose?.();

			router.push(`/?network=${network}`);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	// TODO: reduce complexity here
	// eslint-disable-next-line sonarjs/cognitive-complexity
	const onWalletLogin = async () => {
		try {
			if (!selectedAddress) throw new Error('Please select an address');

			const injectedWindow = window as Window & InjectedWindow;
			const injectedWallet = injectedWindow?.injectedWeb3?.[String(selectedWallet)];
			if (!injectedWallet) throw new Error('Please select an address');

			setLoading(true);

			const injected = injectedWallet && injectedWallet.enable && (await injectedWallet.enable(APP_NAME));

			const signRaw = injected && injected.signer && injected.signer.signRaw;
			if (!signRaw) throw new Error('Signer not available');

			const substrateAddress = getSubstrateAddress(selectedAddress.address) ?? selectedAddress.address;

			const { signature: loginStartSignature } = await signRaw({
				address: substrateAddress,
				data: stringToHex(SIGN_MESSAGE),
				type: 'bytes'
			});

			const { data: addressLoginData, error: addressLoginError } = await nextApiClientFetch<IAuthResponse>({
				network,
				url: 'api/v1/auth/actions/addressLogin',
				isPolkassemblyAPI: true,
				data: {
					address: substrateAddress,
					signature: loginStartSignature,
					wallet: selectedWallet
				}
			});

			if (addressLoginError) {
				// TODO: change this method of checking if user is already signed up
				if (addressLoginError === 'Please sign up prior to logging in with a web3 address') {
					await walletSignup(substrateAddress, signRaw);
					return;
				}

				throw new Error(addressLoginError);
			}

			if (addressLoginData?.token) {
				currentUser.loginWallet = selectedWallet;
				currentUser.loginAddress = selectedAddress.address;
				if (selectedWallet) localStorage.setItem('loginWallet', selectedWallet);
				localStorage.setItem('loginAddress', selectedAddress.address);
				handleTokenChange(addressLoginData.token, currentUser);

				onClose?.();
				router.push(`/?network=${network}`);
			} else if (addressLoginData?.isTFAEnabled) {
				if (!addressLoginData?.tfa_token) throw new Error(error || 'TFA token missing. Please try again.');

				setAuthResponse(addressLoginData);
				setLoading(false);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex flex-col gap-6 p-3 text-sm'>
			{error && <AlertCard message={error} />}

			{authResponse?.isTFAEnabled ? (
				<>
					<form
						onSubmit={handleSubmitTFAForm(onTFASubmit)}
						className='flex flex-col gap-3'
					>
						<div className='flex flex-col gap-3'>
							<h3 className='text-lg font-medium'>Two Factor Authentication</h3>
							<p>Please open the two-step verification app or extension and input the authentication code for your Polkassembly account.</p>
						</div>

						<div>
							<Input
								label='Authentication Code'
								placeholder='######'
								labelPlacement='outside'
								variant='bordered'
								radius='sm'
								classNames={{
									label: INPUT_LABEL_CLASSNAMES,
									inputWrapper: INPUT_WRAPPER_CLASSNAMES
								}}
								isInvalid={Boolean(errorsTFAForm.authCode)}
								disabled={loading}
								{...registerTFAForm('authCode', { required: true, minLength: TFA_CODE_RULES.minLength, maxLength: TFA_CODE_RULES.maxLength })}
							/>
							{Boolean(errorsTFAForm.authCode) && <small className='text-danger'>Please input a vaild authentication code.</small>}
						</div>

						<div className='flex justify-center'>
							<Button
								color='primary'
								className='w-3/6 bg-primary_accent'
								type='submit'
								isLoading={loading}
							>
								Login
							</Button>
						</div>
					</form>

					<Button
						color='default'
						variant='faded'
						className='mx-auto border-none'
						type='button'
						disabled={loading}
						size='sm'
						onClick={() => {
							setAuthResponse(null);
							setError('');
						}}
					>
						Go back
					</Button>
				</>
			) : selectedWallet ? (
				<div className='flex flex-col justify-center gap-6'>
					<h3 className='flex items-center justify-start gap-3 text-lg font-medium capitalize'>
						<Image
							alt='wallet icon'
							src={`/icons/wallets/${selectedWallet.toLowerCase()}.svg`}
							height={24}
							width={24}
						/>
						{selectedWallet.replaceAll('-', ' ')}
					</h3>

					{isSignup && (
						<AlertCard
							type='info'
							message='Address is not registered, signing up...'
						/>
					)}

					<AddressDropdown
						wallet={selectedWallet}
						onAddressSelect={setSelectedAddress}
					/>

					<Button
						color='primary'
						className='mx-auto w-3/6 bg-primary_accent'
						type='button'
						isLoading={loading}
						onPress={onWalletLogin}
					>
						Login
					</Button>

					<Button
						color='default'
						variant='faded'
						className='mx-auto border-none'
						type='button'
						disabled={loading}
						size='sm'
						onClick={() => {
							setError('');
							setAuthResponse(null);
							setSelectedWallet(null);
						}}
					>
						Go back
					</Button>
				</div>
			) : (
				<>
					<div className='text-center text-gray-500'>Login with web-3 wallet: </div>

					<WalletButtonsRow
						disabled={loading}
						onWalletClick={onWalletClick}
					/>
				</>
			)}
		</div>
	);
}

export default LoginForm;
