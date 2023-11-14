// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ServerComponentProps } from '@/global/types';
import React from 'react';

interface IParams {
	id: string;
}

function PostPage({ params }: ServerComponentProps<IParams, unknown>) {
	const postID = params?.id;
	if (!postID) return <div>Post ID not found</div>;

	return <div>PostPage {postID}</div>;
}

export default PostPage;
