// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PASSWORD_RULES, TFA_CODE_RULES, USERNAME_RULES } from '@/global/validationRules';
import { ChallengeMessage, IAuthResponse, TokenType, Wallet } from '@/global/types';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import { handleTokenChange } from '@/services/auth.service';
import { useUserDetailsContext } from '@/contexts';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { InjectedAccount, InjectedWindow } from '@polkadot/extension-inject/types';
import APP_NAME from '@/global/constants/appName';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import { stringToHex } from '@polkadot/util';
import { SignerResult } from '@polkadot/api/types';
import WalletButtonsRow from './WalletButtonsRow';
import AlertCard from '../Misc/AlertCard';
import AddressDropdown from './AddressDropdown';

const INPUT_LABEL_CLASSNAMES = 'text-sm font-normal';
const INPUT_WRAPPER_CLASSNAMES = 'border-primary_border border-1';

function LoginForm({ onClose }: { onClose?: () => void }) {
	const {
		register,
		formState: { errors },
		handleSubmit
	} = useForm({
		defaultValues: {
			usernameOrEmail: '',
			password: ''
		}
	});

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

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const [authResponse, setAuthResponse] = useState<IAuthResponse | null>(null);
	const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
	const [selectedAddress, setSelectedAddress] = useState<InjectedAccount | null>(null);
	const [isSignup, setIsSignup] = useState<boolean>(false);

	const onSubmit = async ({ usernameOrEmail, password }: { usernameOrEmail: string; password: string }) => {
		if (!usernameOrEmail || !password || loading) return;

		setLoading(true);
		setError('');

		const { data, error: loginError } = await nextApiClientFetch<IAuthResponse>({
			url: 'api/v1/auth/actions/login',
			isPolkassemblyAPI: true,
			data: {
				username: usernameOrEmail,
				password
			}
		});

		if (loginError || !data) {
			setError(loginError || 'Login failed. Please try again later.');
			setLoading(false);
			return;
		}

		if (data?.token) {
			handleTokenChange(data.token, currentUser);
			router.back();
		} else if (data?.isTFAEnabled) {
			if (!data?.tfa_token) {
				setError(error || 'TFA token missing. Please try again.');
				setLoading(false);
				return;
			}
			setAuthResponse(data);
			setLoading(false);
		}
	};

	const onTFASubmit = async ({ authCode }: { authCode: string }) => {
		if (Number.isNaN(authCode)) return;

		setLoading(true);
		setError('');

		const { data, error: tfaError } = await nextApiClientFetch<IAuthResponse>({
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

			const { data: signupStartData, error: signupStartError } = await nextApiClientFetch<ChallengeMessage>({
				url: 'api/v1/auth/actions/addressSignupStart',
				isPolkassemblyAPI: true,
				data: { address: substrateAddress }
			});

			if (signupStartError || !signupStartData) throw new Error(signupStartError || 'Something went wrong');

			const signupStartSignMessage = signupStartData?.signMessage;
			if (!signupStartSignMessage) throw new Error('Signup challenge message not found.');

			const { signature: signupSignature } = await signRaw({
				address: substrateAddress,
				data: stringToHex(signupStartSignMessage),
				type: 'bytes'
			});

			const { data: confirmData, error: confirmError } = await nextApiClientFetch<TokenType>({
				url: 'api/v1/auth/actions/addressSignupConfirm',
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

			router.push('/');
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

			const { data: loginStartData, error: loginStartError } = await nextApiClientFetch<ChallengeMessage>({
				url: 'api/v1/auth/actions/addressLoginStart',
				isPolkassemblyAPI: true,
				data: {
					address: substrateAddress,
					wallet: selectedWallet
				}
			});

			if (loginStartError) throw new Error(loginStartError);

			const loginStartSignMessage = loginStartData?.signMessage;
			if (!loginStartSignMessage) throw new Error('Challenge message not found');

			const { signature: loginStartSignature } = await signRaw({
				address: substrateAddress,
				data: stringToHex(loginStartSignMessage),
				type: 'bytes'
			});

			const { data: addressLoginData, error: addressLoginError } = await nextApiClientFetch<IAuthResponse>({
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
				router.push('/');
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
								className='w-3/6'
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
						className='mx-auto w-3/6'
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
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='flex flex-col gap-3'
					>
						<div>
							<Input
								label='Username or Email'
								placeholder='Type here'
								labelPlacement='outside'
								variant='bordered'
								radius='sm'
								classNames={{
									label: INPUT_LABEL_CLASSNAMES,
									inputWrapper: INPUT_WRAPPER_CLASSNAMES
								}}
								isInvalid={Boolean(errors.usernameOrEmail)}
								disabled={loading}
								{...register('usernameOrEmail', { required: true, minLength: USERNAME_RULES.minLength })}
							/>
							{Boolean(errors.usernameOrEmail) && <small className='text-danger'>Please input a vaild username or email.</small>}
						</div>

						<div>
							<Input
								label='Password'
								type='password'
								placeholder='Type here'
								labelPlacement='outside'
								variant='bordered'
								radius='sm'
								classNames={{
									label: INPUT_LABEL_CLASSNAMES,
									inputWrapper: INPUT_WRAPPER_CLASSNAMES
								}}
								isInvalid={Boolean(errors.password)}
								disabled={loading}
								{...register('password', { required: true, minLength: PASSWORD_RULES.minLength })}
							/>
							{Boolean(errors.password) && <small className='text-danger'>Please input a vaild password.</small>}

							<div className='mt-1.5 flex w-full justify-end'>
								<Link
									href='/forgot-password'
									className='text-xs text-primary'
								>
									Forgot Password?
								</Link>
							</div>
						</div>

						<div className='flex justify-center'>
							<Button
								color='primary'
								className='w-3/6'
								type='submit'
								isLoading={loading}
							>
								Login
							</Button>
						</div>
					</form>

					<div className='mt-4 text-center text-gray-500'>Or login with</div>

					<WalletButtonsRow
						disabled={loading}
						onWalletClick={onWalletClick}
					/>

					<div className='w-full text-center font-semibold'>
						Don&apos;t have an account?{' '}
						<Link
							href='/signup'
							className='text-sm text-primary'
							replace
						>
							Sign Up
						</Link>
					</div>
				</>
			)}
		</div>
	);
}

export default LoginForm;
