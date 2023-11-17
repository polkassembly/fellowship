// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import getNetworkFromHeaders from '@/app/api/api-utils/getNetworkFromHeaders';
import withErrorHandling from '@/app/api/api-utils/withErrorHandling';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { APIError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { isValidProposalType } from '@/utils/isValidProposalType';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { CommentReply, ICommentHistory, PostComment, PostCommentResponse, PublicReactionEntry } from '@/global/types';
import { QuerySnapshot, DocumentData } from 'firebase-admin/firestore';
import { commentReactionCollRef, commentRepliesCollRef, postCommentsCollRef } from '../../../firestoreRefs';

export const GET = withErrorHandling(async (req: NextRequest, { params }) => {
	const { proposalType = '', id = '' } = params;
	if (!proposalType || !id || isNaN(id) || !isValidProposalType(proposalType)) throw new APIError(`${MESSAGES.INVALID_PARAMS_ERROR}`, 500, API_ERROR_CODE.INVALID_PARAMS_ERROR);

	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	const reactionsPromises: Promise<QuerySnapshot<DocumentData>>[] = [];
	const repliesPromises: Promise<QuerySnapshot<DocumentData>>[] = [];

	const postComments =
		(await postCommentsCollRef(network, proposalType, String(id)).get()).docs.map((doc) => {
			const commentData = doc.data();

			reactionsPromises.push(commentReactionCollRef(network, proposalType, String(id), String(doc.id)).get());
			repliesPromises.push(commentRepliesCollRef(network, proposalType, String(id), String(doc.id)).get());

			return {
				user_id: commentData.user_id,
				content: commentData.content || '',
				created_at: commentData.created_at?.toDate() || new Date(),
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				history: ((commentData.history || []) as any[]).map(
					(history) =>
						({
							...history,
							created_at: history.created_at?.toDate() || new Date()
						}) as ICommentHistory
				),
				id: commentData.id,
				isDeleted: commentData.isDeleted,
				updated_at: commentData.updated_at?.toDate() || new Date(),
				sentiment: commentData.sentiment || 0,
				username: commentData.username || '',
				user_profile_img: commentData.user_profile_img || ''
			} as PostComment;
		}) || [];

	const reactions = await Promise.all(reactionsPromises);
	const replies = await Promise.all(repliesPromises);

	const postCommentResponses = postComments.map((postComment, index) => {
		const postCommentRes: PostCommentResponse = {
			...postComment,
			reactions: reactions[Number(index)].docs.map((doc) => {
				const reactionData = doc.data();
				return {
					...reactionData,
					created_at: reactionData.created_at?.toDate() || new Date(),
					updated_at: reactionData.updated_at?.toDate() || new Date()
				} as PublicReactionEntry;
			}),
			replies: replies[Number(index)].docs.map((doc) => {
				const replyData = doc.data();
				return {
					...replyData,
					created_at: replyData.created_at?.toDate() || new Date(),
					updated_at: replyData.updated_at?.toDate() || new Date()
				} as CommentReply;
			})
		};

		return postCommentRes;
	});

	return NextResponse.json(postCommentResponses);
});
