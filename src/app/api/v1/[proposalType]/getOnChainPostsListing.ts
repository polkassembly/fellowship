// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { IPostListingItem, IPostListingResponse, Network, ProposalStatus, ProposalType, Reaction } from '@/global/types';
import { urqlClient } from '@/services/urqlClient';
import { APIError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import getDefaultPostContent from '@/utils/getDefaultPostContent';
import DEFAULT_POST_TITLE from '@/global/constants/defaultTitle';
import { postCommentsCollRef, postDocRef, postReactionCollRef } from '../firestoreRefs';
import { GET_POST_LISTING_DATA } from '../subsquidQueries';
import { getSubSquareContentAndTitle } from '../../api-utils/subsquare-content';

// eslint-disable-next-line sonarjs/cognitive-complexity
export async function getOnChainPostsListing({
	network,
	proposalType,
	limit,
	page
}: {
	network: Network;
	proposalType: ProposalType;
	limit: number;
	page: number;
}): Promise<IPostListingResponse> {
	const gqlClient = urqlClient(network);

	const { data: subsquidData, error } = await gqlClient
		.query(GET_POST_LISTING_DATA, {
			limit,
			offset: (page - 1) * limit
		})
		.toPromise();

	if (error) {
		throw new APIError(MESSAGES.API_FETCH_ERROR, 404, API_ERROR_CODE.API_FETCH_ERROR);
	}

	if (!subsquidData || !subsquidData.proposals) {
		throw new APIError(MESSAGES.API_FETCH_ERROR, 404, API_ERROR_CODE.API_FETCH_ERROR);
	}

	if (!subsquidData.proposals.length) {
		return {
			totalCount: 0,
			posts: []
		};
	}

	const postPromises = subsquidData.proposals.map(
		async (proposalData: {
			index: number;
			createdAt: Date | string;
			updatedAt: Date | string;
			description: string;
			proposer: string;
			status: ProposalStatus;
			trackNumber: number;
			hash: string;
		}) => {
			const offChaindata = (await postDocRef(network, proposalType, String(proposalData.index)).get()).data();

			const reactionCounts = await Promise.all(
				Object.values(Reaction).map(async (reaction) => {
					const count = await postReactionCollRef(network, proposalType, String(proposalData.index)).where('reaction', '==', reaction).count().get();
					return { [reaction]: count.data().count || 0 };
				})
			);

			const reactionCountsObject = Object.assign({}, ...reactionCounts);

			let title = offChaindata?.title || DEFAULT_POST_TITLE;
			let content =
				offChaindata?.content ||
				proposalData.description ||
				getDefaultPostContent({
					network,
					proposalType,
					proposerAddress: proposalData.proposer
				});

			// get content and title from subsquare if not available in firestore
			if (!offChaindata?.title || !offChaindata?.content) {
				const { content: subsquareContent, title: subsquareTitle } = await getSubSquareContentAndTitle(ProposalType.FELLOWSHIP_REFERENDUMS, network, proposalData.index);
				if (!offChaindata?.title && subsquareTitle) {
					title = subsquareTitle;
				}
				if (!offChaindata?.content && subsquareContent) {
					content = subsquareContent;
				}
			}

			return {
				comments_count: (await postCommentsCollRef(network, proposalType, String(proposalData.index)).count().get()).data().count || 0,
				content,
				created_at: new Date(proposalData.createdAt) || offChaindata?.created_at?.toDate?.() || new Date(),
				id: proposalData.index,
				post_reactions: reactionCountsObject,
				proposer: proposalData.proposer || offChaindata?.proposer || '',
				status: proposalData.status,
				title,
				type: proposalType,
				updated_at: offChaindata?.updated_at?.toDate?.() || new Date(proposalData.updatedAt),
				user_id: offChaindata?.user_id || null,
				hash: proposalData.hash,
				trackNumber: proposalData.trackNumber
			} as IPostListingItem;
		}
	);

	const posts = await Promise.all(postPromises);

	return {
		totalCount: 0,
		posts
	};
}
