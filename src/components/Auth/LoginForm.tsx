// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PASSWORD_RULES, USERNAME_RULES } from '@/global/validationRules';
import { IAuthResponse } from '@/global/types';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import { handleTokenChange } from '@/services/auth.service';
import { useUserDetailsContext } from '@/contexts';
import { useRouter } from 'next/navigation';
import WalletButtonsRow from './WalletButtonsRow';
import AlertCard from '../Misc/AlertCard';

function LoginForm() {
	const {
		register,
		formState: { errors },
		// control,
		handleSubmit
	} = useForm({
		defaultValues: {
			usernameOrEmail: '',
			password: ''
		}
	});

	const currentUser = useUserDetailsContext();
	const router = useRouter();

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const [authResponse, setAuthResponse] = useState<IAuthResponse | null>(null);

	const onSubmit = async ({ usernameOrEmail, password }: { usernameOrEmail: string; password: string }) => {
		if (!usernameOrEmail || !password || loading) return;

		setLoading(true);

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

	// TODO: Add TFA form

	return (
		<div className='flex flex-col gap-6 p-3 text-sm'>
			{error && <AlertCard message={error} />}

			{authResponse?.isTFAEnabled ? (
				<>TFA is enabled for this account. Please enter the code from your authenticator app.</>
			) : (
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
								label: 'text-sm font-normal',
								inputWrapper: 'border-primary_border border-1'
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
								label: 'text-sm font-normal',
								inputWrapper: 'border-primary_border border-1'
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
			)}

			<div className='mt-4 text-center text-gray-500'>Or login with</div>

			<WalletButtonsRow disabled={loading} />

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
		</div>
	);
}

export default LoginForm;
