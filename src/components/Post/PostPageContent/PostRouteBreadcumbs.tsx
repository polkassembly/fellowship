// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import LinkWithNetwork from '@/components/Misc/LinkWithNetwork';
import { usePostDataContext } from '@/contexts';
import { SubsquidActivityType } from '@/global/types';
import midTruncateText from '@/utils/midTruncateText';
import React from 'react';

const getLinkAndLabel = (type: SubsquidActivityType) => {
	switch (type) {
		case SubsquidActivityType.GeneralProposal:
			return {
				href: 'general-proposals',
				label: 'General Proposals'
			};
		case SubsquidActivityType.RFC:
			return {
				href: 'rfc-proposals',
				label: 'RFC Proposals'
			};
		case SubsquidActivityType.RetentionRequest:
		case SubsquidActivityType.PromotionRequest:
		case SubsquidActivityType.DemotionRequest:
		case SubsquidActivityType.InductionRequest:
			return {
				href: 'rank-requests',
				label: 'Rank Proposals'
			};
		default: {
			return {
				href: '',
				label: 'Home'
			};
		}
	}
};

function PostRouteBreadcumbs() {
	const {
		postData: { title, on_chain_info: onChainInfo }
	} = usePostDataContext();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const linkAndLabel = getLinkAndLabel(onChainInfo?.activity_type as any);

	return (
		<div className='flex gap-3 text-xs'>
			<LinkWithNetwork
				href={`/${linkAndLabel?.href}`}
				className='capitalize text-link'
			>
				{linkAndLabel?.label}
			</LinkWithNetwork>

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
