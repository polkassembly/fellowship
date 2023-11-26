// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import AddReactionBtn from './AddReactionBtn';
import AddViewBtn from './AddViewBtn';
import AddSubscriptionBtn from './AddSubscriptionBtn';
import SharePostBtn from './SharePostBtn';

interface Props {
	className?: string;
}

function PostActionBar({ className }: Props) {
	return (
		<section className={`${className} flex items-center justify-between`}>
			<div className='flex items-center gap-0.5'>
				<AddReactionBtn />

				<span className='text-xs'>0</span>
			</div>

			<div className='flex items-center gap-0.5'>
				<AddViewBtn />

				<span className='text-xs'>0</span>
			</div>

			<div className='flex items-center gap-0.5'>
				<AddSubscriptionBtn />

				<span className='text-xs'>0</span>
			</div>

			<div className='flex items-center gap-0.5'>
				<SharePostBtn />

				<span className='text-xs'>0</span>
			</div>
		</section>
	);
}

export default PostActionBar;
