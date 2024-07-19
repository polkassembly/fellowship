// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { headers } from 'next/headers';
import { APIError } from '@/global/exceptions';
import { urqlClient } from '@/services/urqlClient';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import MESSAGES from '@/global/messages';
import { TRENDING_LIMIT } from '@/global/constants/listingLimit';
import { ProposalStatus, ProposalType, TrendingProposalItem } from '@/global/types';
import DEFAULT_POST_TITLE from '@/global/constants/defaultTitle';
import { NextRequest, NextResponse } from 'next/server';
import dayjs from '@/services/dayjs-init';
import { GET_TRENDING_PROPOSALS } from '../../subsquidQueries';
import getReqBody from '../../../api-utils/getReqBody';
import getNetworkFromHeaders from '../../../api-utils/getNetworkFromHeaders';
import withErrorHandling from '../../../api-utils/withErrorHandling';
import getFirestoreDocs from '../utils';
import { getSubSquareContentAndTitle } from '../../../api-utils/subsquare-content';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const POST = withErrorHandling(async (req: NextRequest) => {
	const { page = 1 } = await getReqBody(req);

	if (!page || isNaN(page) || Number(page) < 1) throw new APIError(`${MESSAGES.REQ_BODY_ERROR}`, 500, API_ERROR_CODE.REQ_BODY_ERROR);

	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	const gqlClient = urqlClient(network);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const variables: any = {
		limit: TRENDING_LIMIT,
		offset: (page - 1) * TRENDING_LIMIT,
		status: [ProposalStatus.Deciding]
	};

	const proposalMap: {
		[key: string]: TrendingProposalItem;
	} = {};

	const result = await gqlClient.query(GET_TRENDING_PROPOSALS, variables).toPromise();

	if (result.error) throw new APIError(`${result.error || MESSAGES.SUBSQUID_FETCH_ERROR}`, 500, API_ERROR_CODE.SUBSQUID_FETCH_ERROR);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let onChainProposals = (result?.data?.activities || []).map((item: any) => {
		return {
			activityType: item.type,
			...item.proposal
		};
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onChainProposals?.forEach((onChainProposalObj: any) => {
		proposalMap[onChainProposalObj.index] = onChainProposalObj;
	});

	onChainProposals = Object.values(proposalMap).reverse();

	const { firestoreProposalDocs } = await getFirestoreDocs(onChainProposals, network);

	// assign proposal data to proposalsData
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const proposalItemsPromises: Promise<TrendingProposalItem>[] = onChainProposals.map(async (onChainProposalObj: any) => {
		const firestoreProposalData = firestoreProposalDocs.find((item) => String(item.id) === String(onChainProposalObj?.index))?.data?.() || {};

		if (!firestoreProposalData?.title) {
			const { title } = await getSubSquareContentAndTitle(ProposalType.FELLOWSHIP_REFERENDUMS, network, onChainProposalObj.index);
			if (!firestoreProposalData?.title && title) {
				firestoreProposalData.title = title;
			}
		}

		const trendingProposal: TrendingProposalItem = {
			id: onChainProposalObj.index,
			user_id: firestoreProposalData.user_id ?? null,
			title: firestoreProposalData.title ?? DEFAULT_POST_TITLE,
			status: onChainProposalObj.status,
			total_votes_count: Number(onChainProposalObj.tally?.ayes ?? 0) + Number(onChainProposalObj.tally?.nays ?? 0),
			created_at: dayjs(onChainProposalObj.createdAt ?? firestoreProposalData.created_at?.toDate() ?? new Date()).toDate(),
			updated_at: dayjs(firestoreProposalData.updated_at?.toDate() ?? onChainProposalObj.updatedAt ?? new Date()).toDate(),
			proposalType: ProposalType.FELLOWSHIP_REFERENDUMS
		};

		return trendingProposal;
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const proposalItems = (await Promise.allSettled(proposalItemsPromises)).filter((item) => item.status === 'fulfilled').map((item) => (item as any).value);

	return NextResponse.json(proposalItems);
});
