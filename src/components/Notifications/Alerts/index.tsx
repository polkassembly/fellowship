// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useEffect } from 'react';
import { CheckboxGroup, Checkbox } from '@nextui-org/checkbox';
import { useApiContext } from '@/contexts';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import { ETriggerType, ITriggerPreferences, SubsquidProposalType, INetworkPreferences } from '@/global/types';

export default function ProposalAlertsCard({
	networkPreferences
}: Readonly<{
	networkPreferences: INetworkPreferences;
}>) {
	const [selected, setSelected] = React.useState(['']);
	const { network } = useApiContext();

	const setTriggerPreferences = async (triggerName: string, preferences: ITriggerPreferences) => {
		try {
			await nextApiClientFetch({
				url: 'api/v1/auth/actions/setTriggerPreferences',
				data: {
					network,
					trigger_name: triggerName,
					trigger_preferences: preferences
				},
				network,
				isPolkassemblyAPI: true
			});
		} catch (e) {
			console.log(e);
		}
	};

	const handleTriggerChange = (triggerName: ETriggerType) => {
		const value = !selected.includes(triggerName);

		setTriggerPreferences(triggerName, {
			enabled: value,
			post_types: [SubsquidProposalType.FELLOWSHIP_REFERENDUMS],
			name: triggerName
		});
	};

	const alertOptions = [
		{
			value: ETriggerType.PROPOSAL_CREATED,
			label: 'New proposals created'
		},
		{
			value: ETriggerType.PROPOSAL_IN_VOTING,
			label: 'Proposal in voting'
		},
		{
			value: ETriggerType.PROPOSAL_CLOSED,
			label: 'Proposal closed for voting'
		}
	];

	useEffect(() => {
		const triggerPreferences = networkPreferences?.triggerPreferences[network] || {};
		const selectedTriggers = Object.keys(triggerPreferences).filter((key) => triggerPreferences[key].enabled);

		setSelected(selectedTriggers);
	}, [networkPreferences, network]);

	return (
		<CheckboxGroup
			value={selected}
			onValueChange={setSelected}
			radius='sm'
		>
			{alertOptions.map(({ value, label }) => (
				<Checkbox
					key={value}
					value={value}
					onChange={() => handleTriggerChange(value)}
				>
					{label}
				</Checkbox>
			))}
		</CheckboxGroup>
	);
}
