// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import LoginForm from '@/components/Auth/LoginForm';
import React from 'react';
import Image from 'next/image';

function LoginPage() {
	return (
		<div className='mx-auto flex max-w-xl flex-col gap-4 rounded-2xl border border-primary_border p-6'>
			<h1 className='flex gap-2 text-xl font-semibold'>
				<Image
					alt='Login Icon'
					src='/icons/login.svg'
					width={24}
					height={24}
					className='ml-[-8px] mr-2'
				/>
				Login
			</h1>

			<LoginForm />
		</div>
	);
}

export default LoginPage;
