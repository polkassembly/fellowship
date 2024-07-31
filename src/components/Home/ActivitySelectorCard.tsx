// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useState, useRef } from 'react';
import { Card } from '@nextui-org/card';
import { RadioGroup, Radio } from '@nextui-org/radio';
import { EActivityFeed } from '@/global/types';
import { useRouter } from 'next/navigation';
import { useApiContext } from '@/contexts';
import Image from 'next/image';
import { Button } from '@nextui-org/button';

function ActivitySelectorCard({ value = EActivityFeed.ALL }: { value?: EActivityFeed }) {
	const router = useRouter();
	const { network } = useApiContext();
	const elementRef = useRef<HTMLDivElement>(null);

	const [isScrollingRight, setIsScrollingRight] = useState(true);

	const handleHorizontalScroll = (speed: number, distance: number, step: number) => {
		let scrollAmount = 0;
		const element = elementRef.current;

		if (!element) return;

		const maxScrollLeft = element.scrollWidth - element.clientWidth;
		const slideTimer = setInterval(() => {
			element.scrollLeft += step;
			scrollAmount += Math.abs(step);
			if (scrollAmount >= distance) {
				clearInterval(slideTimer);
			}
			if (element.scrollLeft >= maxScrollLeft) {
				setIsScrollingRight(false);
			} else if (element.scrollLeft <= 0) {
				setIsScrollingRight(true);
			}
		}, speed);
	};

	const handleOnValueChange = (activityValue: string) => {
		router.push(`/?feed=${activityValue}&network=${network}`);
	};

	return (
		<Card
			className='flex flex-col gap-y-3 border border-primary_border bg-cardBg p-6'
			shadow='none'
			radius='lg'
		>
			<h2 className='text-xl font-semibold'>Activity</h2>
			<div className='relative flex items-center'>
				<div
					ref={elementRef}
					className='w-full overflow-hidden'
				>
					<RadioGroup
						orientation='horizontal'
						classNames={{
							wrapper: 'gap-8 flex-nowrap min-w-[530px]'
						}}
						defaultValue={value.toString()}
						onValueChange={handleOnValueChange}
					>
						{Object.values(EActivityFeed).map((feedType) => (
							<Radio
								key={feedType}
								value={feedType}
								size='md'
								classNames={{
									label: 'flex items-center'
								}}
							>
								<span className='text-xs capitalize'>{feedType.replaceAll('-', ' ')}</span>
							</Radio>
						))}
					</RadioGroup>
				</div>
				{isScrollingRight ? (
					<Button
						onClick={() => {
							handleHorizontalScroll(5, 100, 10);
						}}
						isIconOnly
						radius='full'
						size='sm'
						className='absolute -right-3 flex items-center justify-center border border-primary_border bg-cardBg shadow-lg md:hidden'
					>
						<Image
							width={12}
							height={12}
							src='/icons/chevron-right.svg'
							alt='chevron'
							className='dark:grayscale dark:invert dark:filter'
						/>
					</Button>
				) : (
					<Button
						onClick={() => {
							handleHorizontalScroll(5, 100, -10);
						}}
						isIconOnly
						radius='full'
						size='sm'
						className='absolute -right-3 flex items-center justify-center border border-primary_border bg-cardBg shadow-lg md:hidden'
					>
						<Image
							width={12}
							height={12}
							src='/icons/chevron-right.svg'
							alt='chevron'
							className='rotate-180 dark:grayscale dark:invert dark:filter'
						/>
					</Button>
				)}
			</div>
		</Card>
	);
}

export default ActivitySelectorCard;
