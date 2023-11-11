// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProposalType } from '@/global/types';

export function getSinglePostLinkFromProposalType(proposalType: ProposalType): string {
	switch (proposalType) {
		case ProposalType.DISCUSSIONS:
			return 'post';
		case ProposalType.FELLOWSHIP_REFERENDUMS:
			return 'referenda';
		default:
			return '';
	}
}
