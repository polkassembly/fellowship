// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';
import { Pie } from '@nivo/pie';
import { BN } from '@polkadot/util';
import THEME_COLORS from '@/global/themeColors';
import { useTheme } from 'next-themes';
import { Tooltip } from '@nextui-org/tooltip';

interface Props {
	className?: string;
	ayes: string;
	nays: string;
}

function ListingVoteProgress({ className = '', ayes, nays }: Props) {
	const { resolvedTheme = 'light' } = useTheme();

	let ayesBN = new BN(ayes);
	const naysBN = new BN(nays);

	let graphColours = [THEME_COLORS[resolvedTheme as keyof typeof THEME_COLORS].voteAye, THEME_COLORS[resolvedTheme as keyof typeof THEME_COLORS].voteNay];

	// set one of the values to 50 and set colours to bg
	if (ayesBN.isZero() && naysBN.isZero()) {
		ayesBN = new BN(50);
		graphColours = [THEME_COLORS[resolvedTheme as keyof typeof THEME_COLORS].graphBg];
	}

	const data = [
		{
			id: 'ayes',
			label: 'ayes',
			value: ayesBN.toNumber(),
			color: THEME_COLORS[resolvedTheme as keyof typeof THEME_COLORS].voteAye
		},
		{
			id: 'nays',
			label: 'nays',
			value: naysBN.toNumber(),
			color: THEME_COLORS[resolvedTheme as keyof typeof THEME_COLORS].voteNay
		}
	];

	return (
		<Tooltip
			showArrow
			content={
				<section className='flex flex-col gap-1 text-xs'>
					<div>Ayes: {ayes}</div>
					<div>Nays: {nays}</div>
				</section>
			}
			className='bg-tooltip_background text-tooltip_foreground'
			classNames={{
				arrow: 'bg-tooltip_background'
			}}
		>
			<div className={className}>
				<Pie
					height={12}
					width={24}
					data={data}
					startAngle={-90}
					endAngle={90}
					innerRadius={0.8}
					enableArcLabels={false}
					enableArcLinkLabels={false}
					isInteractive={false}
					animate={false}
					colors={graphColours}
					fit
				/>
			</div>
		</Tooltip>
	);
}

export default ListingVoteProgress;
