// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';
import Image from 'next/image';
import SectionTitle from './common-ui/SectionTitle';
import NotificationChannels from './NotificationChannels';
import ProposalsNotificationCard from './Proposals';
import ProposalAlertsCard from './Alerts';

const accordionItemClassNames = {
	base: 'rounded-[20px] border border-primary_border w-full mx-0',
	heading: 'data-[open=true]:border-b border-primary_border',
	title: 'text-base',
	indicator: 'mr-6 -rotate-90 data-[open=true]:rotate-90 text-lg [&_*]:stroke-[2.5px] text-primary_text',
	content: 'p-6',
	icon: 'dark:contrast-[200%] dark:grayscale dark:invert dark:filter mr-2'
};

export default function Notifications() {
	return (
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
				<NotificationChannels />
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
