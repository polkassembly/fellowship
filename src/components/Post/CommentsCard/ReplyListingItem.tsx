// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CommentReply, PostCommentResponse } from '@/global/types';
import { Avatar } from '@nextui-org/avatar';
import React from 'react';
import Markdown from '@/components/TextEditor/Markdown';
import ContentListingHeader from '../ContentListingHeader';

interface Props {
	className?: string;
	reply: CommentReply;
	parentComment: PostCommentResponse;
}

// TODO: make use of comment for replying
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
function ReplyListingItem({ className, parentComment, reply }: Props) {
	return (
		<div className={`${className} flex items-start justify-start gap-3`}>
			<Avatar
				src={reply.user_profile_img}
				name={reply.username?.[0].toUpperCase()}
			/>

			<section className='flex flex-1 flex-col'>
				<article className='flex flex-col gap-y-3 rounded-3xl bg-secondary/10 px-6 py-3'>
					<ContentListingHeader
						username={reply.username}
						createdAt={reply.created_at}
					/>

					<Markdown md={reply.content} />
				</article>
			</section>
		</div>
	);
}

export default ReplyListingItem;
