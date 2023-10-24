// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProposalStatus } from '@/global/types';
import { Chip } from '@nextui-org/chip';
import React from 'react';

const tagColoursClasses: { [index: string]: string } = {
	[ProposalStatus.PASSING]: 'bg-success text-white'
};

function StatusChip({ value }: { value: ProposalStatus }) {
	return (
		<Chip
			size='sm'
			className={`capitalize ${tagColoursClasses[value as string]}`}
		>
			<span className='text-xs'>{value}</span>
		</Chip>
	);
}

export default StatusChip;
