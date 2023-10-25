// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Image from 'next/image';
import { Tooltip } from '@nextui-org/tooltip';

function DecidingEndsHeader() {
	return (
		<Tooltip
			showArrow
			content='Deciding Ends in X days: Y hours'
			className='bg-tooltip_background text-tooltip_foreground'
			classNames={{
				arrow: 'bg-tooltip_background'
			}}
		>
			<div className='flex gap-1'>
				<Image
					src='/icons/post/deciding-ends-clock-blue.svg'
					width={16}
					height={16}
					alt='Clock Icon'
				/>
			</div>
		</Tooltip>
	);
}

export default DecidingEndsHeader;
