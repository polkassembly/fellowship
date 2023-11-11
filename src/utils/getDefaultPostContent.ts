// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Network, ProposalType } from '@/global/types';
import getPostTypeNameFromPostType from './getPostTypeNameFromPostType';
import getEncodedAddress from './getEncodedAddress';

interface Params {
	proposalType: ProposalType;
	proposerAddress: string;
	network: Network;
}

export default function getDefaultPostContent({ network, proposalType, proposerAddress }: Params) {
	return `This is a ${getPostTypeNameFromPostType(proposalType)} whose proposer address (${getEncodedAddress(
		proposerAddress,
		network
	)}) is shown in on-chain info below. Only this user can edit this description and the title. If you own this account, login and tell us more about your proposal.`;
}
