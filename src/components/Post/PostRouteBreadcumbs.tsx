// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { usePostDataContext } from '@/contexts';
import { ActivityType, ProposalType } from '@/global/types';
import midTruncateText from '@/utils/midTruncateText';
import Link from 'next/link';
import React from 'react';

function PostRouteBreadcumbs() {
	const {
		postData: { title, proposalType }
	} = usePostDataContext();

	const listingView = [ProposalType.DISCUSSIONS, ProposalType.FELLOWSHIP_REFERENDUMS].includes(proposalType) ? ActivityType.GENERAL_PROPOSAL.replaceAll('-', ' ') : '';

	return (
		<div className='flex gap-3 text-xs'>
			<Link
				href='/'
				className='capitalize text-link'
			>
				{listingView}
			</Link>

			<span>&gt;</span>

			<span>
				{midTruncateText({
					text: title,
					startChars: 14,
					endChars: 14,
					separator: ' .... '
				})}
			</span>
		</div>
	);
}

export default PostRouteBreadcumbs;
