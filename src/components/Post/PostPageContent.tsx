// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import PostDataContextProvider from '@/contexts/PostDataContext';
import { IPost } from '@/global/types';
import React from 'react';
import PostRouteBreadcumbs from './PostRouteBreadcumbs';
import PostArticleCard from './PostArticleCard';

interface Props {
	post: IPost;
}

function PostPageContent({ post }: Props) {
	return (
		<PostDataContextProvider postItem={post}>
			<section className='flex flex-col gap-3'>
				<PostRouteBreadcumbs />

				<div className='flex gap-8'>
					<PostArticleCard className='w-9/12' />

					<div className='flex-1 bg-green-400'>Sidebar</div>
				</div>
			</section>
		</PostDataContextProvider>
	);
}

export default PostPageContent;
