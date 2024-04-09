// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';
import { CheckboxGroup, Checkbox } from '@nextui-org/checkbox';

export default function ProposalAlertsCard() {
	const [selected, setSelected] = React.useState(['in-voting']);
	return (
		<CheckboxGroup
			value={selected}
			onValueChange={setSelected}
			radius='sm'
		>
			<Checkbox value='new'>New proposals created</Checkbox>
			<Checkbox value='in-voting'>Proposal in voting</Checkbox>
			<Checkbox value='closed'>Proposal closed for voting</Checkbox>
		</CheckboxGroup>
	);
}
