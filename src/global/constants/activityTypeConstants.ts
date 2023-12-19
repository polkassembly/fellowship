// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActivityType } from '@/global/types';

export const ACTIVITY_TYPE_DESC = {
	[ActivityType.GENERAL_PROPOSAL]: 'General Proposal',
	[ActivityType.RANK_REQUEST]: 'Rank Request',
	[ActivityType.FELLOWSHIP_RULE]: 'Fellowship Rule',
	[ActivityType.INDUCTION]: 'Induction'
};

export const ACTIVITY_ACTION_TEXT = {
	[ActivityType.GENERAL_PROPOSAL]: 'cast vote',
	[ActivityType.RANK_REQUEST]: 'cast vote',
	[ActivityType.INDUCTION]: 'induct to fellowship',
	[ActivityType.RFC_PULL_REQUEST]: 'Create RFC Proposal'
};
