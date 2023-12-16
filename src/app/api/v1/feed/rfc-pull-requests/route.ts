// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RFCPullRequestItem } from '@/global/types';
import { NextRequest, NextResponse } from 'next/server';
import getReqBody from '@/app/api/api-utils/getReqBody';
import withErrorHandling from '@/app/api/api-utils/withErrorHandling';
import { urqlClientGithub } from '@/services/urqlClientGithub';
import { LISTING_LIMIT } from '@/global/constants/listingLimit';
import { APIError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import dayjs from '@/services/dayjs-init';
import { GET_FELLOWSHIP_PULL_REQUESTS } from '../../subsquidQueries';

// TODO: Optimise API
export const POST = withErrorHandling(async (req: NextRequest) => {
	const { lastCursor = null } = await getReqBody(req);

	const gqlClient = urqlClientGithub();

	const result = await gqlClient
		.query(GET_FELLOWSHIP_PULL_REQUESTS, {
			cursor: lastCursor,
			limit: LISTING_LIMIT
		})
		.toPromise();

	if (result.error || !result.data) throw new APIError(`${result.error || MESSAGES.GITHUB_FETCH_ERROR}`, 500, API_ERROR_CODE.GITHUB_FETCH_ERROR);

	const pullRequests = result.data.repository.pullRequests.edges || [];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const feedItems: RFCPullRequestItem[] = pullRequests.map((item: any) => {
		return {
			id: Number(item.node.number),
			title: String(item.node.title),
			url: String(item.node.url),
			created_at: dayjs(item.node.createdAt).toDate(),
			username: String(item.node.author.login),
			cursor: String(item.cursor)
		} as RFCPullRequestItem;
	});

	return NextResponse.json(feedItems);
});
