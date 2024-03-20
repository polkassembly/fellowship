// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActivityType } from '@/global/types';

export const ACTIVITY_TYPE_DESC = {
	[ActivityType.GENERAL_PROPOSAL]: 'Whitelisted proposals by the fellowship to fast track their decision timeline',
	[ActivityType.RANK_REQUEST]: 'Proposing a change in rank of fellowship members via approval, promotion or demotion',
	[ActivityType.FELLOWSHIP_RULE]: 'Proposing a change to existing fellowship rules',
	[ActivityType.INDUCTION]:
		'Users who aspire to be fellows can create an induction request with details of their proof of works. Fellows may comment or choose to create a proposal for these requests.'
};

export const ACTIVITY_ACTION_TEXT = {
	[ActivityType.GENERAL_PROPOSAL]: 'cast vote',
	[ActivityType.RANK_REQUEST]: 'cast vote',
	[ActivityType.INDUCTION]: 'induct to fellowship',
	[ActivityType.RFC_PULL_REQUEST]: 'Create RFC Proposal'
};
