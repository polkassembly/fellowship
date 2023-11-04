// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Input } from '@nextui-org/input';
import React from 'react';
import { useForm } from 'react-hook-form';

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
		<div className='flex flex-col p-3'>
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
				</div>
			</form>
		</div>
	);
}

export default LoginForm;
