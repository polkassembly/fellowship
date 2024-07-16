// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState, useEffect } from 'react';
import { useApiContext } from '@/contexts';
import { Calendar } from '@nextui-org/calendar';
import { today, getLocalTimeZone } from '@internationalized/date';
import {
	fetchAuctionInfo,
	fetchDemocracyDispatches,
	fetchDemocracyLaunch,
	fetchParachainLease,
	fetchScheduled,
	fetchSocietyChallenge,
	fetchSocietyRotate,
	fetchStakingInfo,
	fetchTreasurySpend
} from '@/utils/getCalendarEvents';
import dayjs from 'dayjs';
import Image from 'next/image';
import { IEvent } from '@/global/types';
import Events from '@/components/Calendar/Events';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import { Button } from '@nextui-org/button';

export default function CreateRFCProposal() {
	const { api, apiReady, network } = useApiContext();
	const [calendarEvents, setCalendarEvents] = useState<IEvent[]>([]);
	const [eventsLoading, setEventsLoading] = useState<boolean>(true);
	const [currentDate, setCurrentDate] = useState(today(getLocalTimeZone()));
	const [focusedDate, setFocusedDate] = useState<Date>(new Date());

	useEffect(() => {
		if (!api || !apiReady || ['polymesh'].includes(network)) {
			return;
		}

		const processEvents = (eventResult: any, title: string, idPrefix: string, formatContent: (obj: any) => string) => {
			if (eventResult.status !== 'fulfilled') return [];

			return eventResult.value.map((eventObj: any, index: number) => {
				return {
					content: formatContent(eventObj),
					end_time: dayjs(eventObj.endDate).toDate(),
					id: `${idPrefix}_${index}`,
					location: '',
					start_time: dayjs(eventObj.endDate).toDate(),
					status: 'approved',
					title,
					url: '',
					participants: []
				};
			});
		};

		const formatStakingInfoContent = (eventObj: any) => {
			return eventObj.type === 'stakingEpoch'
				? `Start of a new staking session ${eventObj?.data?.index}`
				: eventObj.type === 'stakingEra'
				? `Start of a new staking era ${eventObj?.data?.index}`
				: `${eventObj.type} ${eventObj?.data?.index}`;
		};

		const formatScheduledContent = (eventObj: any) => (eventObj?.data?.id ? `Execute named scheduled task ${eventObj?.data?.id}` : 'Execute anonymous scheduled task');

		const formatTreasurySpendContent = (eventObj: any) => `Start of next spend period ${eventObj?.data?.spendingPeriod}`;

		const formatDemocracyDispatchContent = (eventObj: any) => `Democracy Dispatch ${eventObj?.data?.index}`;

		const formatDemocracyLaunchContent = (eventObj: any) => `Start of next referendum voting period ${eventObj?.data?.launchPeriod}`;

		const formatSocietyRotateContent = (eventObj: any) => `Acceptance of new members and bids ${eventObj?.data?.rotateRound}`;

		const formatSocietyChallengeContent = (eventObj: any) => `Start of next membership challenge period ${eventObj?.data?.challengePeriod}`;

		const formatAuctionInfoContent = (eventObj: any) => `End of the current parachain auction ${eventObj?.data?.leasePeriod}`;

		const formatParachainLeaseContent = (eventObj: any) => `Start of the next parachain lease period ${eventObj?.data?.leasePeriod}`;

		const fetchData = async () => {
			setEventsLoading(true);

			const eventFetchers = [
				fetchStakingInfo(api, network),
				fetchScheduled(api, network),
				fetchTreasurySpend(api, network),
				fetchDemocracyDispatches(api, network),
				fetchDemocracyLaunch(api, network),
				fetchSocietyRotate(api, network),
				fetchSocietyChallenge(api, network),
				fetchAuctionInfo(api, network),
				fetchParachainLease(api, network)
			];

			const [
				stakingInfoEvents,
				scheduledEvents,
				treasurySpendEvents,
				democracyDispatchEvents,
				democracyLaunchEvents,
				societyRotateEvents,
				societyChallengeEvents,
				auctionInfoEvents,
				parachainLeaseEvents
			] = await Promise.allSettled(eventFetchers);

			const processedEvents = [
				...processEvents(stakingInfoEvents, 'Staking Info', 'stakingInfoEvent', formatStakingInfoContent),
				...processEvents(scheduledEvents, 'Scheduled Task', 'scheduledEvent', formatScheduledContent),
				...processEvents(treasurySpendEvents, 'Treasury Spend', 'treasurySpendEvent', formatTreasurySpendContent),
				...processEvents(democracyDispatchEvents, 'Democracy Dispatch', 'democracyDispatchEvent', formatDemocracyDispatchContent),
				...processEvents(democracyLaunchEvents, 'Democracy Launch', 'democracyLaunchEvent', formatDemocracyLaunchContent),
				...processEvents(societyRotateEvents, 'Society Rotate', 'societyRotateEvent', formatSocietyRotateContent),
				...processEvents(societyChallengeEvents, 'Society Challenge', 'societyChallengeEvent', formatSocietyChallengeContent),
				...processEvents(auctionInfoEvents, 'Auction Info', 'auctionInfoEvent', formatAuctionInfoContent),
				...processEvents(parachainLeaseEvents, 'Parachain Lease', 'parachainLeaseEvent', formatParachainLeaseContent)
			];

			setCalendarEvents(processedEvents);
			setEventsLoading(false);
		};

		fetchData();
	}, [api, apiReady, network]);

	useEffect(() => {
		const parsedDate = new Date(`${currentDate.year}-${currentDate.month}-${currentDate.day}`);
		setFocusedDate(parsedDate);
	}, [currentDate]);
	useEffect(() => {
		const gridCells = document.querySelectorAll("td[role='gridcell']");

		gridCells.forEach((gridCell) => {
			const cell = gridCell.childNodes[0] as HTMLElement;
			const cellDate = new Date(
				cell
					.getAttribute('aria-label')
					?.replace(/(selected|Today,)/g, '')
					.trim() as string
			);

			console.log('cellDate', cellDate);

			const calendarEventsForDate = calendarEvents.filter((event) => event.start_time.toDateString() === cellDate.toDateString());

			console.log('calendarEventsForDate', calendarEventsForDate);

			if (calendarEventsForDate.length <= 0) return;

			// Check if indicators are already appended
			const indicatorExists = cell.querySelector('.event-indicator-container');
			if (indicatorExists) return;

			const eventIndicatorContainer = document.createElement('span');
			eventIndicatorContainer.classList.add('flex', 'items-center', 'justify-center', 'gap-0.5', 'w-full', 'h-2', 'event-indicator-container');

			const eventIndicator = document.createElement('span');
			eventIndicator.classList.add('w-1.5', 'h-1.5', 'rounded-full', 'bg-success');

			const eventIndicatorTwo = document.createElement('span');
			eventIndicatorTwo.classList.add('w-1.5', 'h-1.5', 'rounded-full', 'bg-warning');

			eventIndicatorContainer.appendChild(eventIndicator);
			eventIndicatorContainer.appendChild(eventIndicatorTwo);

			cell.appendChild(eventIndicatorContainer);
		});
	}, [calendarEvents, focusedDate]);

	return (
		<div className='flex flex-col-reverse gap-8 lg:flex-row'>
			<div className='mb-5 flex w-full flex-col gap-5 rounded-2xl border border-primary_border bg-content1 p-5 shadow-md lg:max-h-[calc(100vh-100px)] lg:w-2/3 lg:overflow-y-scroll'>
				<div className='flex items-center gap-2 border-b pb-3'>
					<Image
						src='/icons/calendar.svg'
						alt='calendar icon'
						width={32}
						height={32}
						className='dark:grayscale dark:invert dark:filter'
					/>
					<h2 className='w-full text-xl font-semibold'>
						Events <span className='text-secondaryText ml-2 text-sm font-thin'>{focusedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
					</h2>
				</div>
				<div className='flex h-full flex-col gap-5'>
					{eventsLoading ? (
						<div className='flex w-full items-center justify-center p-10'>
							<LoadingSpinner
								message='Fetching Events...'
								size='lg'
							/>
						</div>
					) : (
						<Events
							events={calendarEvents}
							selectedDate={focusedDate}
						/>
					)}
				</div>
			</div>

			<div className='mb-5 flex h-fit w-full flex-col gap-5 rounded-2xl border border-primary_border bg-content1 p-5 shadow-md lg:w-1/3'>
				<div className='flex items-center gap-2'>
					<Image
						src='/icons/calendar.svg'
						alt='calendar icon'
						width={32}
						height={32}
						className='dark:grayscale dark:invert dark:filter'
					/>
					<h1 className='text-xl font-bold'>Calendar</h1>
					<Button
						variant='bordered'
						size='md'
						radius='sm'
						className='ml-auto px-3 py-1'
						onClick={() => setCurrentDate(today(getLocalTimeZone()))}
					>
						Today
					</Button>
				</div>
				<Calendar
					aria-label='Calendar Events'
					className='w-full'
					value={currentDate}
					focusedValue={currentDate}
					onFocusChange={setCurrentDate}
					onChange={setCurrentDate}
					classNames={{
						base: 'bg-content1 border border-primary_border rounded-2xl',
						prevButton: 'border border-primary_border rounded-md',
						nextButton: 'border border-primary_border rounded-md',
						title: 'font-bold text-base text-foreground',
						gridWrapper: 'bg-content1',
						gridHeaderCell: 'w-full',
						gridBodyRow: 'px-4',
						cell: 'w-full flex items-center justify-center',
						cellButton: 'md:w-10 md:h-10 data-[today=true]:border data-[today=true]:border-primary relative flex items-center justify-center flex-col gap-0.5'
					}}
				/>
			</div>
		</div>
	);
}
