// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import PostDataContextProvider from '@/contexts/PostDataContext';
import { IPost } from '@/global/types';
import React, { useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import Image from 'next/image';
import CommentsContextProvider from '@/contexts/CommentsContext';
import { useUserDetailsContext } from '@/contexts';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import PostArticleCard from './PostArticleCard';
import CommentsCard from '../CommentsCard';
import PostRouteBreadcumbs from './PostRouteBreadcumbs';
import EditPostCard from './EditPostCard';
import GovernanceSidebar from '../GovernanceSidebar';

interface Props {
	post: IPost;
}

function PostPageContent({ post }: Props) {
	const { id, addresses, loginAddress } = useUserDetailsContext();

	const [isEditing, setIsEditing] = useState(false);
	const [canEdit, setCanEdit] = useState(false);

	// Can edit
	useEffect(() => {
		if (!id) return;

		if (post.user_id === id) {
			setCanEdit(true);
			return;
		}

		if (!post.on_chain_info?.proposer) return;

		const proposerAddress = getSubstrateAddress(post.on_chain_info?.proposer);

		const userAddresses = (addresses || []).concat([loginAddress]).map((address) => getSubstrateAddress(address));
		setCanEdit(userAddresses.includes(proposerAddress));
	}, [addresses, id, loginAddress, post.on_chain_info?.proposer, post.user_id]);

	return (
		<PostDataContextProvider postItem={post}>
			<section className='flex gap-8'>
				<div className='flex w-9/12 flex-col gap-6'>
					<div className='flex items-center justify-between'>
						<PostRouteBreadcumbs />

						{canEdit && (
							<Button
								size='sm'
								variant='flat'
								className='flex items-center text-primary'
								color='primary'
								onPress={() => setIsEditing(!isEditing)}
							>
								<Image
									alt='Login Icon'
									src='/icons/post/edit-pencil-square.svg'
									width={16}
									height={16}
								/>
								{isEditing ? 'Cancel Edit' : 'Edit Post'}
							</Button>
						)}
					</div>

					{isEditing ? <EditPostCard /> : <PostArticleCard />}

					<CommentsContextProvider initPostComments={[]}>
						<CommentsCard
							postId={Number(post.id)}
							proposalType={post.proposalType}
						/>
					</CommentsContextProvider>
				</div>

				<div className={`${canEdit ? 'mt-14' : 'mt-10'} flex-1`}>
					<GovernanceSidebar />
				</div>
			</section>
		</PostDataContextProvider>
	);
}

export default PostPageContent;
