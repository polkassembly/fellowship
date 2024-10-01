// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ClientError } from '@/global/exceptions';
import { IPreimageResponse, ServerComponentProps } from '@/global/types';
import React from 'react';
import { headers } from 'next/headers';
import getOriginUrl from '@/utils/getOriginUrl';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import PreimageCard from '@/components/Preimage/PreImageCard';
import getPreimageById from '@/app/api/v1/preimages/[id]/getPreimgeById';

interface IParams {
	id: string;
}

async function Transaction({ params }: ServerComponentProps<IParams, unknown>) {
	const preimageId = params?.id;

	if (!preimageId) {
		throw new ClientError(API_ERROR_CODE.INVALID_PARAMS_ERROR);
	}

	const headersList = headers();
	const originUrl = getOriginUrl(headersList);
	const preimage: IPreimageResponse = await getPreimageById({ originUrl, id: preimageId });

	if (!preimage) {
		throw new ClientError(API_ERROR_CODE.POST_NOT_FOUND_ERROR);
	}

	return (
		<div className='flex w-full flex-col gap-6 rounded-3xl bg-cardBg p-3 md:p-5'>
			<div>
				<h1 className='text-xl font-bold uppercase'>Preimage ({preimage?.id})</h1>
			</div>
			<PreimageCard
				preimage={preimage}
				showProposedCall
			/>
		</div>
	);
}

export default Transaction;
