// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import getPRDetails from '@/app/api/v1/getPRDetails/getPRDetails';
import CreateRFCProposalModal from '@/components/CreateRFCProposal/CreateRFCProposalModal';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { ClientError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { Network, ServerComponentProps } from '@/global/types';
import getOriginUrl from '@/utils/getOriginUrl';
import { headers } from 'next/headers';
import React from 'react';

interface IParams {
	id: string;
}

type SearchParamProps = {
	network?: string;
};

async function InductMemberModalPage({ params, searchParams }: ServerComponentProps<IParams, SearchParamProps>) {
	const prId = params?.id;
	const { network } = searchParams ?? {};

	// validate id
	if (isNaN(Number(prId))) {
		throw new ClientError(MESSAGES.INVALID_PARAMS_ERROR, API_ERROR_CODE.INVALID_PARAMS_ERROR);
	}

	const headersList = headers();
	const originUrl = getOriginUrl(headersList);

	const prItem = await getPRDetails({ id: Number(prId), originUrl, network: network as Network });

	return <CreateRFCProposalModal prItem={prItem} />;
}

export default InductMemberModalPage;
