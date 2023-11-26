// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import getPost from '@/app/api/v1/[proposalType]/[id]/getPost';
import InductMemberModal from '@/components/InductMember/InductMemberModal';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { ClientError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { ProposalType, ServerComponentProps } from '@/global/types';
import getOriginUrl from '@/utils/getOriginUrl';
import { headers } from 'next/headers';
import React from 'react';

interface IParams {
	id: string;
}

async function InductMemberModalPage({ params }: ServerComponentProps<IParams, unknown>) {
	const postID = params?.id;

	// validate id
	if (isNaN(Number(postID))) {
		throw new ClientError(MESSAGES.INVALID_PARAMS_ERROR, API_ERROR_CODE.INVALID_PARAMS_ERROR);
	}

	const headersList = headers();
	const originUrl = getOriginUrl(headersList);

	const post = await getPost({ id: Number(postID), originUrl, proposalType: ProposalType.DISCUSSIONS });

	return <InductMemberModal post={post} />;
}

export default InductMemberModalPage;
