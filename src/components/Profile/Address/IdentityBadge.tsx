// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Image from 'next/image';

interface Props {
	onChainIdentity?: any;
	iconSize?: number;
}

function IdentityBadge({ onChainIdentity, iconSize = 12 }: Props) {
	if (!onChainIdentity) return null;

	const minifiedIconSize = iconSize <= 12 ? 12 : iconSize - 4;

	const judgements = onChainIdentity?.identity?.judgements.filter(([, judgement]: any): boolean => !judgement.isFeePaid);
	const isGood = judgements?.some(([, judgement]: any): boolean => judgement.isKnownGood || judgement.isReasonable);
	const isBad = judgements?.some(([, judgement]: any): boolean => judgement.isErroneous || judgement.isLowQuality);

	let iconUrl = '';

	if (isGood) iconUrl = '/icons/verified-check-green.svg';
	if (isBad) iconUrl = '/icons/minus-circle-red.svg';

	if (!iconUrl) return null;

	return (
		<Image
			alt='Identity Verification Badge'
			src={iconUrl}
			width={minifiedIconSize}
			height={minifiedIconSize}
		/>
	);
}

export default IdentityBadge;
