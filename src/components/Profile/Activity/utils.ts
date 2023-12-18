// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubsquidActivityType, UserActivityListingItem } from '@/global/types';

const getCreatedAtDate = (feedItem: UserActivityListingItem) => {
	return feedItem.otherActions?.createdAt || feedItem?.payout?.createdAt || feedItem?.vote?.timestamp || feedItem?.proposal?.createdAt || '';
};

const getProposalTitle = (feedItem: UserActivityListingItem) => {
	const { activityType } = feedItem;
	return `${activityType === SubsquidActivityType.RFC ? 'RFC' : activityType === SubsquidActivityType.GeneralProposal ? 'General' : 'Rank request'} Proposal #${
		feedItem?.proposal?.index || feedItem?.vote?.proposalIndex || ''
	}`;
};

const getActivityIconSrc = (feedItem: UserActivityListingItem) => {
	if (feedItem.activityType === SubsquidActivityType.Voted) {
		if (feedItem.vote?.decision === 'yes') {
			return '/icons/activity/voted-aye.svg';
		}
		return '/icons/activity/voted-nay.svg';
	}
	return '/icons/activity/created-proposal.svg';
};

export { getCreatedAtDate, getActivityIconSrc, getProposalTitle };
