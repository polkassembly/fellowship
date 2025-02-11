// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import getNetworkFromHeaders from '@/app/api/api-utils/getNetworkFromHeaders';
import { getSubSquareContentAndTitle } from '@/app/api/api-utils/subsquare-content';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { LISTING_LIMIT, RANK_ACTIVITY_LISTING_LIMIT } from '@/global/constants/listingLimit';
import { APIError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { ProposalType, SubsquidActivityType, UserActivityListingItem } from '@/global/types';
import { urqlClient } from '@/services/urqlClient';
import getEncodedAddress from '@/utils/getEncodedAddress';
import { headers } from 'next/headers';
import getDefaultPostContent from '@/utils/getDefaultPostContent';
import DEFAULT_POST_TITLE from '@/global/constants/defaultTitle';
import { postsCollRef } from '../../../firestoreRefs';
import { GER_USER_ACTIVITY, GET_RANK_ACTIVITY } from '../../../subsquidQueries';

const getProposalIndex = (activity: UserActivityListingItem) => {
	if (activity?.proposal?.index || activity?.proposal?.index === 0) {
		return activity.proposal.index;
	}
	if (activity?.vote?.proposalIndex || activity?.vote?.proposalIndex === 0) {
		return activity.vote.proposalIndex;
	}
	return null;
};

const getProposalIndexes = (activities: UserActivityListingItem[]) => {
	const proposalIndexes = new Set<number>();
	activities.forEach((activity) => {
		const index = getProposalIndex(activity);
		if (index || index === 0) {
			proposalIndexes.add(index);
		}
	});
	return proposalIndexes;
};

interface Metadata {
	title: string;
	content: string;
	index: number | string;
}

const mergeTitleContent = (activities: UserActivityListingItem[], titleContentMap: Map<string, Metadata>) => {
	return activities.map((activity) => {
		const newActivity = {
			...activity
		};

		const index = getProposalIndex(activity);

		const metadata = titleContentMap.get(`${index || ''}`);
		if (metadata) {
			if (!newActivity.proposal) {
				newActivity.proposal = {};
			}
			newActivity.proposal.title = metadata.title;
			newActivity.proposal.content = metadata.content;
		}

		return newActivity;
	});
};

const consumeTitleContent = (metadatas: Metadata[], titleContentMap: Map<string, Metadata>) => {
	metadatas.forEach((md) => {
		const { title, content, index } = md;
		if (title || content) {
			const metadata = titleContentMap.get(`${index || ''}`);
			if (metadata) {
				if (!metadata.title || !metadata.content) {
					metadata.title = metadata.title || title || '';
					metadata.content = metadata.content || content || '';
					titleContentMap.set(`${index || ''}`, metadata);
				}
			} else {
				titleContentMap.set(`${index || ''}`, {
					title: title || '',
					content: content || '',
					index: index || ''
				});
			}
		}
	});
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export const getUserActivityFeedServer = async (address: string, page: number): Promise<UserActivityListingItem[]> => {
	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	const gqlClient = urqlClient(network);

	const encodedAddress = getEncodedAddress(address, network);

	const variables = {
		limit: LISTING_LIMIT,
		offset: (page - 1) * LISTING_LIMIT,
		who_eq: encodedAddress
	};

	const result = await gqlClient.query(GER_USER_ACTIVITY, variables).toPromise();
	if (result.error) throw new APIError(`${result.error || MESSAGES.SUBSQUID_FETCH_ERROR}`, 500, API_ERROR_CODE.SUBSQUID_FETCH_ERROR);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let activities: UserActivityListingItem[] = (result?.data?.activities || [])?.map((item: any) => {
		return {
			...item,
			activityType: item.type,
			who: item.who
		};
	});

	const proposalIndexes = getProposalIndexes(activities);

	const indexes = Array.from(proposalIndexes);
	const querySnapshot = await postsCollRef(network, ProposalType.FELLOWSHIP_REFERENDUMS).where('index', 'in', indexes).get();

	const titleContentMap = new Map<string, Metadata>();
	let metadatas = querySnapshot.docs
		.map((doc) => {
			if (doc.exists) {
				const data = doc.data();
				return {
					title: data.title || '',
					content: data.content || '',
					index: doc.ref.id
				} as Metadata;
			}
			return null;
		})
		.filter((item) => item !== null) as Metadata[];
	consumeTitleContent(metadatas, titleContentMap);

	try {
		const metadataPromises = indexes.map(async (index) => {
			const metadata = titleContentMap.get(`${index || ''}`);
			if (metadata?.title && metadata?.content) {
				return null;
			}
			try {
				const { content, title } = await getSubSquareContentAndTitle(ProposalType.FELLOWSHIP_REFERENDUMS, network, index);
				if (title || content) {
					return {
						title: title || '',
						content: content || '',
						index: index || ''
					} as Metadata;
				}
			} catch (error) {
				//
			}
			return null;
		});
		metadatas = (await Promise.allSettled(metadataPromises)).map((item) => (item.status === 'fulfilled' ? item.value : null)).filter((item) => item !== null) as Metadata[];

		consumeTitleContent(metadatas, titleContentMap);
		consumeTitleContent(
			activities.map((activity) => {
				const index = getProposalIndex(activity);
				return {
					title: DEFAULT_POST_TITLE,
					content: getDefaultPostContent({
						network,
						proposalType: ProposalType.FELLOWSHIP_REFERENDUMS,
						proposerAddress: activity.who || activity?.vote?.voter || activity?.proposal?.proposer || ''
					}),
					index: index || ''
				} as Metadata;
			}),
			titleContentMap
		);

		activities = mergeTitleContent(activities, titleContentMap);
	} catch (error) {
		//
	}
	return activities;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export const getUserRankActivityServer = async (address: string, page: number): Promise<UserActivityListingItem[]> => {
	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	const gqlClient = urqlClient(network);

	const encodedAddress = getEncodedAddress(address, network);

	const variables = {
		limit: RANK_ACTIVITY_LISTING_LIMIT,
		offset: (page - 1) * RANK_ACTIVITY_LISTING_LIMIT,
		who_eq: encodedAddress,
		orderBy: 'createdAtBlock',
		orderDirection: 'desc',
		activityType_eq: [
			SubsquidActivityType.Promoted,
			SubsquidActivityType.Demoted,
			SubsquidActivityType.Inducted,
			SubsquidActivityType.Retained,
			SubsquidActivityType.EvidenceJudged,
			SubsquidActivityType.EvidenceSubmitted,
			SubsquidActivityType.PromotionRequest,
			SubsquidActivityType.Imported
		]
	};

	const result = await gqlClient.query(GET_RANK_ACTIVITY, variables).toPromise();
	if (result.error) throw new APIError(`${result.error || MESSAGES.SUBSQUID_FETCH_ERROR}`, 500, API_ERROR_CODE.SUBSQUID_FETCH_ERROR);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const activities: UserActivityListingItem[] = (result?.data?.activities || [])?.map((item: any) => {
		return {
			...item,
			activityType: item.type,
			who: item.who
		};
	});

	return activities;
};
