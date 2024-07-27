// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProposalStatus } from '@/global/types';
import { Chip } from '@nextui-org/chip';
import React from 'react';

const failedStateClasses = 'bg-[#BD2020] text-white';
const passedStateClasses = 'bg-[#478F37] text-white';
const activeStateClasses = 'bg-[#FF6700] text-white';

const tagColoursClasses: { [index: string]: string } = {
	[ProposalStatus.Passed]: passedStateClasses,
	[ProposalStatus.Active]: 'bg-[#3C74E1] text-white',
	[ProposalStatus.Executed]: passedStateClasses,
	[ProposalStatus.Confirmed]: passedStateClasses,
	[ProposalStatus.Deciding]: activeStateClasses,
	[ProposalStatus.DecisionDepositPlaced]: activeStateClasses,
	[ProposalStatus.ExecutionFailed]: failedStateClasses,
	[ProposalStatus.Rejected]: failedStateClasses,
	[ProposalStatus.Submitted]: 'bg-[#3C74E1] text-white',
	[ProposalStatus.TimedOut]: failedStateClasses
};

function StatusChip({ status, className }: { status: ProposalStatus; className?: string }) {
	const titleCase = status.replace(/([A-Z])/g, ' $1');
	const statusText = titleCase.charAt(0).toUpperCase() + titleCase.slice(1);

	return (
		<Chip
			size='sm'
			className={`${className} max-h-[18px] capitalize ${tagColoursClasses[status as string]}`}
		>
			<span className='text-xs font-medium'>{statusText}</span>
		</Chip>
	);
}

export default StatusChip;
