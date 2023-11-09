// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { headers } from 'next/headers';
// import { EActivityFeed } from '@/global/types';
import { APIError } from '@/global/exceptions';
import { urqlClient } from '@/services/urqlClient';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import MESSAGES from '@/global/messages';
import { GET_FELLOWSHIP_REFERENDUMS } from '../subsquidQueries';
import getReqBody from '../../api-utils/getReqBody';
import getNetworkFromHeaders from '../../api-utils/getNetworkFromHeaders';
import textEncode from '../../api-utils/textEncode';
import withErrorHandling from '../../api-utils/withErrorHandling';

export const POST = withErrorHandling(async (req: Request) => {
	// TODO: Add feed type
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
	const { feed } = await getReqBody(req);

	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	const feedStream = new ReadableStream({
		start(controller) {
			const gqlClient = urqlClient(network);

			gqlClient.query(GET_FELLOWSHIP_REFERENDUMS, {}).subscribe((result) => {
				if (result.error) {
					controller.error(new APIError(`${result.error || MESSAGES.STREAM_ERROR}`, 500, API_ERROR_CODE.STREAM_ERROR));
					controller.close();
				}

				const encodedData = textEncode(result.data);
				controller.enqueue(encodedData);
			});
		}
	});

	return new Response(feedStream);
});
