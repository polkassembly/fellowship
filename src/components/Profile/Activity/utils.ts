// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UserActivityListingItem } from '@/global/types';

const getActivityType = (feedItem: UserActivityListingItem) => {
	if (feedItem?.vote) {
		if (feedItem.vote.decision === 'no') return 'VOTED_NAY';
		return 'VOTED_AYE';
	}
	return 'OTHER';
};

const getCreatedAtDate = (feedItem: UserActivityListingItem) => {
	return feedItem.otherActions?.createdAt || feedItem?.payout?.createdAt || feedItem?.vote?.timestamp || feedItem?.proposal?.createdAt || '';
};

const iconTypes: {
	[key: string]: string;
} = {
	VOTED_AYE: '/icons/activity/voted-aye.svg',
	VOTED_NAY: '/icons/activity/voted-nay.svg',
	OTHER: '/icons/activity/created-proposal.svg',
	ADDED_COMMENT: '/icons/activity/added-comment.svg'
};

export { getActivityType, getCreatedAtDate, iconTypes };
