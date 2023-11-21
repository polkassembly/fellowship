// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';
import { Button } from '@nextui-org/button';
import Image from 'next/image';
import { VoteDecisionType } from '@/global/types';

interface Props {
	className?: string;
	voteType: VoteDecisionType;
	onClick?: () => void;
}

function VoteButton({ className = '', voteType = VoteDecisionType.AYE, onClick }: Props) {
	return (
		<Button
			className={`${className} ${voteType === 'aye' ? 'bg-voteAye' : 'bg-voteNay'} flex w-full items-center gap-1.5 rounded-full text-base capitalize text-white`}
			size='sm'
			onPress={onClick}
		>
			<Image
				alt='Login Icon'
				src='/icons/thumbs-up-white.svg'
				width={16}
				height={16}
				className={`${voteType === 'nay' && 'rotate-180'} ml-[-8px] mr-2 h-[40px]`}
			/>
			Vote {voteType}
		</Button>
	);
}

export default VoteButton;
