// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Chip } from '@nextui-org/chip';
import React from 'react';

function PostTags({ tags = [] }: { tags: string[] }) {
	return (
		tags.length > 0 && (
			<section className='flex gap-3'>
				{tags.map((tag) => (
					<Chip
						key={tag}
						className='border-1'
						variant='bordered'
						size='sm'
						radius='sm'
					>
						<p className='text-xs font-medium'>{tag}</p>
					</Chip>
				))}
			</section>
		)
	);
}

export default PostTags;
