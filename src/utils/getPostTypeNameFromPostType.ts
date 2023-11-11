// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProposalType } from '@/global/types';

export default function getPostTypeNameFromPostType(proposalType: ProposalType) {
	const postTypeNameMap: { [key in ProposalType]: string } = {
		[ProposalType.FELLOWSHIP_REFERENDUMS]: 'fellowship referendum',
		[ProposalType.DISCUSSIONS]: 'discussion'
	};

	return postTypeNameMap[String(proposalType) as ProposalType] || proposalType;
}
