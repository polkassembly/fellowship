// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import PostDataContextProvider from '@/contexts/PostDataContext';
import { IPost } from '@/global/types';
import React from 'react';
import PostRouteBreadcumbs from './PostRouteBreadcumbs';
import PostArticleCard from './PostArticleCard';
import CommentsCard from './CommentsCard';

interface Props {
	post: IPost;
}

function PostPageContent({ post }: Props) {
	return (
		<PostDataContextProvider postItem={post}>
			<section className='flex flex-col gap-3'>
				<PostRouteBreadcumbs />

				<div className='flex gap-8'>
					<div className='flex w-9/12 flex-col gap-6'>
						<PostArticleCard />
						<CommentsCard
							postId={Number(post.id)}
							proposalType={post.proposalType}
						/>
					</div>

					<div className='flex-1 bg-green-400'>Sidebar</div>
				</div>
			</section>
		</PostDataContextProvider>
	);
}

export default PostPageContent;
