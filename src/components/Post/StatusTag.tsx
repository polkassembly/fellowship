// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProposalStatus } from '@/global/types';
import { Chip } from '@nextui-org/chip';
import React from 'react';

const tagColoursClasses: { [index: string]: string } = {
	[ProposalStatus.Passed]: 'bg-success text-white',
	[ProposalStatus.Active]: 'bg-[#3C74E1] text-white',
	[ProposalStatus.Executed]: 'bg-[#478F37] text-white',
	[ProposalStatus.Deciding]: 'bg-[#FF6700] text-white',
	[ProposalStatus.ExecutionFailed]: 'bg-[#BD2020] text-white',
	[ProposalStatus.Rejected]: 'bg-[#BD2020] text-white'
};

function StatusChip({ status }: { status: ProposalStatus }) {
	return (
		<Chip
			size='sm'
			className={`max-h-[18px] capitalize ${tagColoursClasses[status as string]}`}
		>
			<span className='text-xs font-medium'>{status}</span>
		</Chip>
	);
}

export default StatusChip;
