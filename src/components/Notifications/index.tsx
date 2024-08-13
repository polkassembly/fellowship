// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import Image from 'next/image';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import { Network, CHANNEL, INetworkPreferences } from '@/global/types';
import queueNotification from '@/utils/queueNotification';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import SectionTitle from './common-ui/SectionTitle';
import NotificationChannels from './NotificationChannels';
import ProposalsNotificationCard from './Proposals';
import ProposalAlertsCard from './Alerts';
import LoadingSpinner from '../Misc/LoadingSpinner';

const accordionItemClassNames = {
	base: 'rounded-[20px] border border-primary_border w-full mx-0',
	heading: 'data-[open=true]:border-b border-primary_border',
	title: 'text-base',
	indicator: 'mr-6 -rotate-90 data-[open=true]:rotate-90 text-lg [&_*]:stroke-[2.5px] text-primary_text',
	content: 'p-6',
	icon: 'dark:contrast-[200%] dark:grayscale dark:invert dark:filter mr-2'
};

export default function Notifications() {
	const { network } = useApiContext();
	const { networkPreferences: defaultNetworkPreferences, setUserDetailsContextState } = useUserDetailsContext();
	const [currNetworkPreferences, setNetworkPreferences] = useState<INetworkPreferences>(defaultNetworkPreferences);
	const [loading, setLoading] = useState(true);

	const getNotificationSettings = async (network: string) => {
		if (!network) {
			return;
		}
		try {
			const { data, error } = (await nextApiClientFetch({
				url: 'api/v1/auth/data/notificationSettings',
				network: network as Network,
				isPolkassemblyAPI: true
			})) as { data: any; error: null | string };
			if (error) {
				throw new Error(error);
			}

			let networkPreferences: any = {};
			if (data?.notification_preferences?.channelPreferences) {
				networkPreferences = {
					...currNetworkPreferences,
					channelPreferences: data?.notification_preferences?.channelPreferences
				};
			}
			if (data?.notification_preferences?.triggerPreferences) {
				networkPreferences = {
					...networkPreferences,
					triggerPreferences: data?.notification_preferences?.triggerPreferences
				};
				setUserDetailsContextState((currentUser) => ({
					...currentUser,
					networkPreferences
				}));
				setNetworkPreferences(networkPreferences);
			}
		} catch (e) {
			console.log(e);
			queueNotification({
				header: 'Error!',
				message: (e as Error).message || 'Failed to fetch notification settings',
				status: 'error'
			});
		} finally {
			setLoading(false);
		}
	};

	const toggleChannelPreferences = async (channel: CHANNEL, enabled = false) => {
		try {
			setUserDetailsContextState((currentUser) => ({
				...currentUser,
				networkPreferences: {
					...currentUser.networkPreferences,
					channelPreferences: {
						...currentUser.networkPreferences?.channelPreferences,
						[channel]: {
							...currentUser.networkPreferences?.channelPreferences?.channel,
							enabled
						}
					}
				}
			}));

			const { data, error } = (await nextApiClientFetch({
				url: 'api/v1/auth/actions/updateChannelNotification',
				data: {
					channel,
					enabled
				},
				network: network as Network,
				isPolkassemblyAPI: true
			})) as { data: { message: string }; error: string | null };
			if (error || !data.message) {
				throw new Error(error || '');
			}

			return true;
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		getNotificationSettings(network);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [network]);

	return loading ? (
		<LoadingSpinner
			message='Fetching Notifications Settings...'
			size='lg'
		/>
	) : (
		<Accordion
			className='flex w-full flex-col gap-[24px] p-0'
			showDivider={false}
			selectionMode='multiple'
		>
			<AccordionItem
				className=''
				key='notification-channels'
				aria-label='notification-channels'
				classNames={accordionItemClassNames}
				title={
					<SectionTitle
						icon={
							<Image
								alt='notification icon'
								src='/icons/settings/notification-channels.svg'
								width={24}
								height={24}
								className={accordionItemClassNames.icon}
							/>
						}
						title='Notification Channels'
					/>
				}
			>
				<NotificationChannels
					toggleChannelPreferences={toggleChannelPreferences}
					networkPreferences={currNetworkPreferences}
				/>
			</AccordionItem>

			<AccordionItem
				key='proposals'
				aria-label='proposals'
				classNames={accordionItemClassNames}
				title={
					<SectionTitle
						icon={
							<Image
								alt='notification icon'
								src='/icons/settings/proposal-icon.svg'
								width={24}
								height={24}
								className={accordionItemClassNames.icon}
							/>
						}
						title='My Proposals'
						desc='Update your proposal notifications here'
					/>
				}
			>
				<ProposalsNotificationCard />
			</AccordionItem>

			<AccordionItem
				key='alerts'
				aria-label='alerts'
				classNames={accordionItemClassNames}
				title={
					<SectionTitle
						title='Alerts'
						desc='Receive updates for following'
					/>
				}
			>
				<ProposalAlertsCard />
			</AccordionItem>
		</Accordion>
	);
}
