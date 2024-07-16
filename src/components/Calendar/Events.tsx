// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useState } from 'react';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { IEvent } from '@/global/types';
import { Button } from '@nextui-org/button';
import EventHeader from './EventHeader';
import JoinEventButton from './JoinEventButton';
import EventParticipant from './EventParticipant';

const accordionItemClassNames = {
	base: 'rounded-[20px] border border-primary_border w-full mx-0',
	heading: 'data-[open=true]:border-b border-primary_border',
	title: 'text-base',
	indicator: 'mr-5 rotate-180 data-[open=true]:rotate-90 text-lg [&_*]:stroke-[2.5px] text-primary_text',
	content: 'p-5',
	icon: 'dark:contrast-[200%] dark:grayscale dark:invert dark:filter mr-2'
};

export default function Events({ events, selectedDate }: { events: IEvent[]; selectedDate: Date }) {
	const filteredEvents = events.filter((event) => event.start_time.toDateString() === selectedDate.toDateString());

	const [showAll, setShowAll] = useState(false);

	const toggleShowAll = () => {
		setShowAll(!showAll);
	};

	if (filteredEvents.length === 0) {
		return <p className='flex h-full w-full items-center justify-center p-10'>No current events</p>;
	}

	return (
		<Accordion
			className='flex w-full flex-col gap-3 p-0'
			showDivider={false}
			selectionMode='multiple'
		>
			{filteredEvents.map((event) => {
				const startTime = event.start_time.toLocaleTimeString();
				const endTime = event.end_time.toLocaleTimeString();

				return (
					<AccordionItem
						className=''
						key={event.id}
						aria-label='event'
						classNames={accordionItemClassNames}
						title={
							<EventHeader
								title={event.title}
								startTime={startTime}
								endTime={endTime}
								category='Fellowship'
							/>
						}
					>
						<div className='flex flex-col gap-5'>
							<p>{event.content}</p>
							{event.participants?.length > 0 && (
								<div className='flex flex-col gap-5'>
									<div className='flex items-center gap-5'>
										<h3 className='text-base font-semibold leading-6'>Participants ({event.participants?.length})</h3>
										{event.participants.length > 3 && (
											<Button
												variant='light'
												className='ml-auto px-3 py-1 text-link'
												onClick={toggleShowAll}
											>
												{showAll ? 'See Less >' : 'See All >'}
											</Button>
										)}
									</div>
									<div className='flex flex-col gap-3'>
										{event.participants.slice(0, showAll ? event.participants.length : 3).map((participant) => (
											<EventParticipant
												key={participant.id}
												name={participant.name}
												avatar={participant.avatar}
												status={participant.status}
											/>
										))}
									</div>
								</div>
							)}

							<JoinEventButton
								platform='meet'
								url={event.url}
							/>
						</div>
					</AccordionItem>
				);
			})}
		</Accordion>
	);
}
