// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';
import { CheckboxGroup, Checkbox } from '@nextui-org/checkbox';

export default function ProposalsNotificationCard() {
	const [selected, setSelected] = React.useState(['comments']);
	return (
		<CheckboxGroup
			value={selected}
			onValueChange={setSelected}
			radius='sm'
		>
			<Checkbox value='comments'>Comments on my posts</Checkbox>
			<Checkbox value='daily-updates'>Daily updates of new likes, dislikes and comments on my posts</Checkbox>
		</CheckboxGroup>
	);
}
