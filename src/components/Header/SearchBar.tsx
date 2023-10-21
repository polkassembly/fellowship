// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Input } from '@nextui-org/input';
import React from 'react';
import Image from 'next/image';

function SearchBar({ className }: { className?: string }) {
	return (
		<Input
			size='sm'
			type='text'
			variant='bordered'
			placeholder='Search'
			startContent={
				<Image
					alt='search icon'
					src='/icons/search.svg'
					width={12}
					height={12}
				/>
			}
			className={className}
			classNames={{
				inputWrapper: ['border-1', 'border-primary_border']
			}}
		/>
	);
}

SearchBar.defaultProps = {
	className: ''
};

export default SearchBar;
