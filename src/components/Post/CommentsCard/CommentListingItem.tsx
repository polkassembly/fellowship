// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PostCommentResponse } from '@/global/types';
import React from 'react';
import { Avatar } from '@nextui-org/avatar';
import Markdown from '@/components/TextEditor/Markdown';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import ContentListingHeader from '../ContentListingHeader';
import ReplyListingItem from './ReplyListingItem';

interface Props {
	comment: PostCommentResponse;
}

function CommentListingItem({ comment }: Props) {
	return (
		<div className='flex items-start justify-start gap-3'>
			<Avatar
				src={comment.user_profile_img}
				name={comment.username?.[0].toUpperCase()}
				className='mt-1'
			/>

			<section className='flex flex-1 flex-col'>
				<article className='flex flex-col gap-y-3 rounded-3xl bg-secondary/10 px-6 py-3'>
					<ContentListingHeader
						username={comment.username}
						createdAt={comment.created_at}
					/>

					<Markdown md={comment.content} />
				</article>

				{Boolean(comment.replies.length) && (
					<Accordion defaultExpandedKeys={['show-replies']}>
						<AccordionItem
							key='show-replies'
							aria-label='Show replies'
							title='Show replies'
							classNames={{
								titleWrapper: 'flex-none',
								content: 'ml-6',
								title: 'text-xs'
							}}
						>
							{comment.replies.map((replyItem) => (
								<ReplyListingItem
									key={`${comment.id}_${replyItem.id}`}
									className='my-2'
									parentComment={comment}
									reply={replyItem}
								/>
							))}
						</AccordionItem>
					</Accordion>
				)}
			</section>
		</div>
	);
}

export default CommentListingItem;
