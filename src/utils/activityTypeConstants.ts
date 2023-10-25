// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActivityType } from '@/global/types';

export const activityTypeDesc = {
	[ActivityType.GENERAL_PROPOSAL]: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua 1',
	[ActivityType.RANK_REQUEST]: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua 2',
	[ActivityType.FELLOWSHIP_RULE]: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua 3',
	[ActivityType.INDUCTION]: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua 4'
};

export const activityActionText = {
	[ActivityType.GENERAL_PROPOSAL]: 'cast vote',
	[ActivityType.RANK_REQUEST]: 'cast vote',
	[ActivityType.INDUCTION]: 'induct to fellowship'
};
