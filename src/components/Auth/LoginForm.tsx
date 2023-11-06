// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import WalletButtonsRow from './WalletButtonsRow';

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

	const onSubmit = (data: unknown) => console.log(data);

	return (
		<div className='flex flex-col gap-6 p-3 text-sm'>
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
							label: 'text-sm font-normal -mb-1',
							inputWrapper: 'border-primary_border border-1'
						}}
						{...register('usernameOrEmail', { required: 'The username or email is required' })}
						aria-invalid={errors.usernameOrEmail ? 'true' : 'false'}
					/>
					{errors.usernameOrEmail?.message && <p role='alert'>{errors.usernameOrEmail.message.toString()}</p>}
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
							label: 'text-sm font-normal -mb-1',
							inputWrapper: 'border-primary_border border-1'
						}}
						{...register('password', { required: 'Password is required' })}
						aria-invalid={errors.password ? 'true' : 'false'}
					/>
					{errors.password?.message && <p role='alert'>{errors.password.message.toString()}</p>}

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
					>
						Login
					</Button>
				</div>
			</form>

			<div className='mt-4 text-center text-gray-500'>Or login with</div>

			<WalletButtonsRow />

			<div className='w-full text-center font-semibold'>
				Don&apos;t have an account?{' '}
				<Link
					href='/signup'
					className='text-sm text-primary'
				>
					Sign Up
				</Link>
			</div>
		</div>
	);
}

export default LoginForm;
