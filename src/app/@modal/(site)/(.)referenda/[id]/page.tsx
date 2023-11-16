// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import PostModal from '@/components/Post/PostModal';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { ClientError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { IPost, ProposalType, ServerComponentProps } from '@/global/types';
import getOriginUrl from '@/utils/getOriginUrl';
import { headers } from 'next/headers';
import React from 'react';

interface IParams {
	id: string;
}

async function getPost({ originUrl, id }: { id: number; originUrl: string }) {
	const feedRes = await fetch(`${originUrl}/api/v1/${ProposalType.FELLOWSHIP_REFERENDUMS}/${id}`).catch((e) => {
		throw new ClientError(`${MESSAGES.API_FETCH_ERROR} - ${e?.message}`, API_ERROR_CODE.API_FETCH_ERROR);
	});

	const post: IPost = await feedRes.json();
	return post;
}

async function PostModalPage({ params }: ServerComponentProps<IParams, unknown>) {
	const postID = params?.id;

	// validate id
	if (isNaN(Number(postID))) {
		throw new ClientError(MESSAGES.INVALID_PARAMS_ERROR, API_ERROR_CODE.INVALID_PARAMS_ERROR);
	}

	const headersList = headers();
	const originUrl = getOriginUrl(headersList);

	const post = await getPost({ id: Number(postID), originUrl });

	return <PostModal post={post} />;
}

export default PostModalPage;
