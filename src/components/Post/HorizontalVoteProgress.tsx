// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { usePostDataContext } from '@/contexts';
import THEME_COLORS from '@/global/themeColors';
import { Progress } from '@nextui-org/progress';
import { BN } from '@polkadot/util';
import { useTheme } from 'next-themes';
import React from 'react';

interface Props {
	className?: string;
}

function HorizontalVoteProgress({ className = '' }: Props) {
	const { resolvedTheme = 'light' } = useTheme();

	const {
		postData: { on_chain_info: onChainInfo }
	} = usePostDataContext();

	const ayes = new BN(onChainInfo?.tally.ayes || 0);
	const nays = new BN(onChainInfo?.tally.nays || 0);

	const totalVotes = ayes.add(nays);

	let ayesPercentage = 0;
	if (!totalVotes.isZero()) {
		ayesPercentage = ayes.muln(100).div(totalVotes).toNumber();
	}

	return (
		<div className={`${className} flex flex-col gap-1.5`}>
			<div className='flex items-center justify-between text-xs'>
				<div className='flex items-center gap-1.5'>
					<span
						style={{
							background: THEME_COLORS[resolvedTheme as keyof typeof THEME_COLORS].voteAye
						}}
						className='inline-block h-[6px] w-[6px] rounded-full'
					/>
					{ayesPercentage}% Ayes
				</div>

				<div className='flex items-center gap-1.5'>
					<span
						style={{
							background: THEME_COLORS[resolvedTheme as keyof typeof THEME_COLORS].voteNay
						}}
						className='inline-block h-[6px] w-[6px] rounded-full'
					/>
					{100 - ayesPercentage}% Nays
				</div>
			</div>

			<Progress
				size='md'
				aria-label='Voting Progress'
				value={ayesPercentage}
				classNames={{
					track: 'bg-voteNay',
					indicator: 'bg-voteAye'
				}}
				className='max-h-[10px]'
			/>
		</div>
	);
}

export default HorizontalVoteProgress;
