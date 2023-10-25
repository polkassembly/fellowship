// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Link from 'next/link';
import React from 'react';
import PostTags from './PostTags';

function PostListingBody() {
	return (
		<section className='flex gap-2'>
			<p className='mt-0.5 text-xs font-normal text-secondary-700'>#{2}</p>
			<article className='flex flex-col gap-1'>
				<h2 className='text-sm font-medium'>Standard Guidelines to judge Liquidity Treasury Proposals on the main governance side - Kusama and Polkadot your Vote!</h2>
				<p className='line-clamp-2 text-sm'>
					Based on the income to the treasuries, the amounts getting burned and the amounts going to proposals, the treasury can be utilised: this includes spending funds,
					extending the comments period, and burning funds. The treasury is a key part of the governance system, and it is important that it is used effectively.
				</p>
				<Link
					className='mb-0.5 text-xs text-link'
					href={`/post/${2}`}
				>
					Read more
				</Link>
				<PostTags tags={['tag1', 'tag2', 'big tag text']} />
			</article>
		</section>
	);
}

export default PostListingBody;
