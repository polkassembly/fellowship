// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { APIError } from '@/global/exceptions';
import { ProposalType } from '@/global/types';
import fetchWithTimeout from '@/utils/timeoutFetch';

const urlMapper = {
	[ProposalType.FELLOWSHIP_REFERENDUMS]: (id: number | string, network: string) => `https://${network}.subsquare.io/api/fellowship/referenda/${id}`
};

export const getSubSquareContentAndTitle = async (proposalType: string | string[], network: string, id: number | string) => {
	try {
		if (!proposalType) {
			throw new APIError('Proposal type missing ', 400);
		}
		if (typeof proposalType !== 'string') {
			throw new APIError('can not send String[] in Proposal type', 400);
		}

		if (!(id || id === 0)) {
			throw new APIError('id is not present', 400);
		}

		if (!network) {
			throw new APIError('Network is  missing', 400);
		}
		const url = new URL(urlMapper[proposalType as keyof typeof urlMapper]?.(id, network));
		const data = await fetchWithTimeout(url, { timeout: 8000 }).then((res) => res.json());

		let subsqTitle = data?.title || '';

		subsqTitle = subsqTitle.length !== 0 ? String(data?.title)?.includes('Untitled') || data?.title : '';

		if (subsqTitle && subsqTitle.includes('[Root] Referendum #')) {
			subsqTitle = subsqTitle.replace(/\[Root\] Referendum #\d+: /, '');
		}

		return { content: data?.content || '', title: subsqTitle };
	} catch (error) {
		return { content: '', title: '' };
	}
};
