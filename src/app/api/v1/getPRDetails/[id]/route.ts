// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RFCPullRequestItem } from '@/global/types';
import { NextRequest, NextResponse } from 'next/server';
import withErrorHandling from '@/app/api/api-utils/withErrorHandling';
import { urqlClientGithub } from '@/services/urqlClientGithub';
import { APIError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import dayjs from '@/services/dayjs-init';
import { GET_FELLOWSHIP_PULL_REQUEST_BY_NUMBER } from '../../subsquidQueries';

export const GET = withErrorHandling(async (req: NextRequest, { params }) => {
	const { id = '' } = params;

	if (!id || isNaN(id)) throw new APIError(`${MESSAGES.INVALID_PARAMS_ERROR}`, 500, API_ERROR_CODE.INVALID_PARAMS_ERROR);

	const gqlClient = urqlClientGithub();

	const result = await gqlClient
		.query(GET_FELLOWSHIP_PULL_REQUEST_BY_NUMBER, {
			prNumber: Number(id)
		})
		.toPromise();

	if (result.error || !result.data) throw new APIError(`${result.error || MESSAGES.GITHUB_FETCH_ERROR}`, 500, API_ERROR_CODE.GITHUB_FETCH_ERROR);

	const { pullRequest } = result.data.repository;

	const prItem: RFCPullRequestItem = {
		id: Number(pullRequest.number),
		title: String(pullRequest.title),
		url: String(pullRequest.url),
		created_at: dayjs(pullRequest.createdAt).toDate(),
		username: String(pullRequest.author.login),
		cursor: ''
	};

	return NextResponse.json(prItem);
});
