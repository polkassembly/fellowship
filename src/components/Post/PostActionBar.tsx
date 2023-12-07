// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import { PostView, ProposalType, PublicReactionEntry } from '@/global/types';
import { v4 as uuidv4 } from 'uuid';
import AddReactionBtn from './AddReactionBtn';
import AddViewBtn from './AddViewBtn';
import AddSubscriptionBtn from './AddSubscriptionBtn';
import SharePostBtn from './SharePostBtn';

interface Props {
	className?: string;
	postId: number | string;
	postType?: ProposalType;
	reactions?: PublicReactionEntry[];
	views?: PostView[];
}

function PostActionBar(props: Props) {
	const { className, postId, postType, reactions: prevReactions, views: prevViews } = props;

	const [views, setViews] = useState<PostView[]>([]);
	const [reactions, setReactions] = useState<PublicReactionEntry[]>([]);

	useEffect(() => {
		if (prevReactions) {
			setReactions(prevReactions);
		}
	}, [prevReactions]);

	useEffect(() => {
		if (prevViews) {
			setViews(prevViews);
		}
	}, [prevViews]);

	const addReaction = (reaction: PublicReactionEntry) => {
		setReactions((prevReactionsState) => {
			const newReactions = [...prevReactionsState];

			const reactionIndex = newReactions.findIndex((reactionEntry) => reactionEntry.id === reaction?.id);

			if (reactionIndex === -1) {
				newReactions.push(reaction);
			} else {
				newReactions.splice(reactionIndex, 1, reaction);
			}

			return newReactions;
		});
	};

	const removeReaction = (reaction: PublicReactionEntry) => {
		setReactions((prevReactionsState) => {
			const newReactions = [...prevReactionsState];

			const reactionIndex = newReactions.findIndex((reactionEntry) => reactionEntry.id === reaction?.id);

			if (reactionIndex >= 0) {
				newReactions.splice(reactionIndex, 1);
			}

			return newReactions;
		});
	};

	const onView = (userId: number) => {
		setViews((prevViewsState) => {
			const newViews = [...prevViewsState];

			const viewIndex = newViews.findIndex((view) => view.user_id === userId);

			if (viewIndex === -1) {
				newViews.push({
					user_id: userId,
					id: uuidv4(),
					views_count: 1,
					created_at: new Date()
				});
			}

			return newViews;
		});
	};

	return (
		<section className={`${className} flex items-center justify-between`}>
			<div className='flex items-center gap-0.5'>
				<AddReactionBtn
					postId={postId}
					postType={postType}
					reactions={reactions}
					addReaction={addReaction}
					removeReaction={removeReaction}
				/>

				<span className='text-xs'>{reactions.length || 0}</span>
			</div>

			<div className='flex items-center gap-0.5'>
				<AddViewBtn
					postId={postId}
					postType={postType}
					onView={onView}
					views={views}
				/>

				<span className='text-xs'>{views.length || 0}</span>
			</div>

			<AddSubscriptionBtn />

			<SharePostBtn />
		</section>
	);
}

export default PostActionBar;
