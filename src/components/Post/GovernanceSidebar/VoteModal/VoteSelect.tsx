// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { VoteDecisionType } from '@/global/types';
import { Tab, Tabs } from '@nextui-org/tabs';
import React, { Key, useState } from 'react';

interface Props {
	defaultVoteType?: VoteDecisionType;
	onSelection: (selected: VoteDecisionType) => void;
	label?: string;
	disabled?: boolean;
}

function VoteSelect({ disabled, defaultVoteType, label, onSelection }: Props) {
	const [selected, setSelected] = useState<VoteDecisionType>(defaultVoteType ?? VoteDecisionType.AYE);

	const handleSelection = (key: Key) => {
		setSelected(key as VoteDecisionType);
		onSelection(key as VoteDecisionType);
	};

	return (
		<div className='flex w-full flex-col items-start gap-1'>
			{label && <small className='text-xs text-foreground/60'>{label}</small>}

			<Tabs
				aria-label='Vote Type Options'
				color='primary'
				variant='bordered'
				selectedKey={selected}
				onSelectionChange={handleSelection}
				size='sm'
				className='w-full'
				classNames={{
					tabList: 'w-full'
				}}
				isDisabled={disabled}
			>
				<Tab
					key={VoteDecisionType.AYE}
					title={
						<div className='flex items-center space-x-2'>
							<span>Aye</span>
						</div>
					}
				/>
				<Tab
					key={VoteDecisionType.NAY}
					title={
						<div className='flex items-center space-x-2'>
							<span>Nay</span>
						</div>
					}
				/>
			</Tabs>
		</div>
	);
}

export default VoteSelect;
