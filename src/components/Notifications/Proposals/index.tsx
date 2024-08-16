// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useEffect } from 'react';
import { CheckboxGroup, Checkbox } from '@nextui-org/checkbox';
import { useApiContext } from '@/contexts';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import { EMentionType, ETriggerType, ITriggerPreferences, INetworkPreferences } from '@/global/types';

export default function ProposalsNotificationCard({
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

		switch (triggerName) {
			case 'newCommentAdded':
				setTriggerPreferences(triggerName, {
					enabled: value,
					name: triggerName,
					sub_triggers: ['commentsOnMyPosts', 'commentsOnSubscribedPosts']
				});
				break;
			case 'newMention':
				setTriggerPreferences(triggerName, {
					enabled: value,
					mention_types: [EMentionType.COMMENT, EMentionType.REPLY],
					name: triggerName
				});
				break;
			case 'dailyUpdates':
				setTriggerPreferences(triggerName, { enabled: value, name: triggerName });
				break;
			default:
				break;
		}
	};

	const proposalOptions = [
		{
			value: ETriggerType.NEW_COMMENT,
			label: 'Comments on my posts'
		},
		{
			value: ETriggerType.NEW_MENTION,
			label: 'Mentions'
		},
		{
			value: ETriggerType.DAILY_UPDATES,
			label: 'Daily updates of new likes, dislikes and comments on my posts'
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
			{proposalOptions.map(({ label, value }) => (
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
