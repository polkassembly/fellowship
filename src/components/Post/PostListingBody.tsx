// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import dynamic from 'next/dynamic';
import PostTags from './PostTags';

const LinkWithNetwork = dynamic(() => import('../Misc/LinkWithNetwork'), { ssr: false }); // for hydration

interface Props {
	index: number;
	title: string;
	content?: string;
	tags?: string[];
	className?: string;
}

function PostListingBody({ className = '', index = 0, title = '', content = '', tags = [] }: Props) {
	return (
		<section className={`flex gap-2 ${className}`}>
			<p className='mt-0.5 hidden text-xs font-normal text-slate-500 md:block'>#{index}</p>
			<article className='flex flex-col gap-1'>
				<h2 className='text-sm font-medium'>{title}</h2>
				{content && (
					<>
						<p className='line-clamp-2 text-sm'>{content}</p>
						{content.length > 200 && (
							<LinkWithNetwork
								className='mb-0.5 text-xs text-link'
								href={`/referenda/${index}`}
							>
								Read more
							</LinkWithNetwork>
						)}
					</>
				)}
				{tags.length > 0 && <PostTags tags={tags} />}
			</article>
		</section>
	);
}

export default PostListingBody;
