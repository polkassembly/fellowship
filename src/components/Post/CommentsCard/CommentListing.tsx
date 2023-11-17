// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { useCommentsContext } from '@/contexts';
import React from 'react';

function CommentListing() {
	const { postComments } = useCommentsContext();

	return (
		<div className='flex flex-col gap-3'>
			{postComments.map((comment) => (
				<div>{comment.content}</div>
			))}
		</div>
	);
}

export default CommentListing;
