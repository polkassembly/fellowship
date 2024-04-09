// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';
import Image from 'next/image';
import SectionTitle from './ui/SectionTitle';

const accordionItemClassNames = {
	base: 'rounded-[20px] border border-primary_border w-full mx-0',
	heading: 'data-[open=true]:border-b border-primary_border',
	title: 'text-base',
	indicator: 'mr-6 -rotate-90 data-[open=true]:rotate-90',
	content: 'p-6'
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
								className='mr-2'
							/>
						}
						title='Notification Channels'
					/>
				}
			>
				<div>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
					exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</div>
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
								className='mr-2'
							/>
						}
						title='My Proposals'
						desc='Update your proposal notifications here'
					/>
				}
			>
				<div>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
					exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</div>
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
				<div>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
					exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</div>
			</AccordionItem>
		</Accordion>
	);
}
