// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useState } from 'react';
import { Input } from '@nextui-org/input';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function SearchPreimageHash() {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState('');

	const handleSearch = (hash: string) => {
		router.replace(`/preimages?hash=${(hash || '').trim()}`);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const transactionId = searchValue.trim();

		handleSearch(transactionId);
	};

	return (
		<form onSubmit={handleSubmit}>
			<Input
				name='search'
				isClearable
				radius='sm'
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
				variant='bordered'
				className='w-52'
				placeholder='Search Hash'
				startContent={
					<Image
						src='/icons/search.svg'
						alt='search icon'
						width={20}
						height={20}
					/>
				}
			/>
		</form>
	);
}

export default SearchPreimageHash;
