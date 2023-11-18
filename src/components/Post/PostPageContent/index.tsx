// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import PostDataContextProvider from '@/contexts/PostDataContext';
import { IPost } from '@/global/types';
import React from 'react';
import { Button } from '@nextui-org/button';
import Image from 'next/image';
import CommentsContextProvider from '@/contexts/CommentsContext';
import PostArticleCard from './PostArticleCard';
import CommentsCard from '../CommentsCard';
import PostRouteBreadcumbs from './PostRouteBreadcumbs';

interface Props {
	post: IPost;
}

function PostPageContent({ post }: Props) {
	return (
		<PostDataContextProvider postItem={post}>
			<div className='flex gap-8'>
				<div className='flex w-9/12 flex-col gap-6'>
					<div className='flex items-center justify-between'>
						<PostRouteBreadcumbs />
						<Button
							size='sm'
							variant='flat'
							className='flex items-center text-primary'
							color='primary'
							onPress={() => console.log('edit post')}
						>
							<Image
								alt='Login Icon'
								src='/icons/post/edit-pencil-square.svg'
								width={16}
								height={16}
							/>
							Edit Post
						</Button>
					</div>

					<PostArticleCard />
					<CommentsContextProvider initPostComments={[]}>
						<CommentsCard
							postId={Number(post.id)}
							proposalType={post.proposalType}
						/>
					</CommentsContextProvider>
				</div>

				<div className='mt-14 flex-1'>Sidebar</div>
			</div>
		</PostDataContextProvider>
	);
}

export default PostPageContent;
