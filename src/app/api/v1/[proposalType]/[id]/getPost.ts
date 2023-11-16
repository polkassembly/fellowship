// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { ClientError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { ProposalType, IPost } from '@/global/types';

export default async function getPost({ originUrl, id }: { id: number; originUrl: string }) {
	const feedRes = await fetch(`${originUrl}/api/v1/${ProposalType.FELLOWSHIP_REFERENDUMS}/${id}`).catch((e) => {
		throw new ClientError(`${MESSAGES.API_FETCH_ERROR} - ${e?.message}`, API_ERROR_CODE.API_FETCH_ERROR);
	});

	const post: IPost = await feedRes.json();
	return post;
}
