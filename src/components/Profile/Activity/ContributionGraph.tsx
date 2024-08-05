// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, cache } from 'react';
import Link from 'next/link';
import { Tooltip } from '@nextui-org/tooltip';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import { getUserCommitHistory } from '@/utils/getUserCommitHistory';
import Image from 'next/image';
import dayjs from '@/services/dayjs-init';
import { getColor } from '@/utils/getGraphContributionsColor';
import { formatContributionDate } from '@/utils/formatContributionDate';

const getCommitHistory = cache(getUserCommitHistory);

function ContributionGraph({ classNames = '', githubUsername, openProfileEdit }: Readonly<{ classNames?: string; githubUsername: string; openProfileEdit: () => void }>) {
	const [contributions, setContributions] = useState<any[]>([]);
	const [totalContributionsCount, setTotalContributionsCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchContributions = async () => {
			try {
				setLoading(true);
				const { contributions, totalContributionsCount } = await getCommitHistory({ username: githubUsername });

				setContributions(contributions);
				setTotalContributionsCount(totalContributionsCount);
			} catch (error) {
				setError((error as Error)?.message);
			} finally {
				setLoading(false);
			}
		};

		fetchContributions();
	}, [githubUsername]);

	if (error || !contributions) return <p>Error: {error ?? 'No contributions found!'}</p>;

	const today = dayjs();
	const lastYear = dayjs().subtract(1, 'year').add(1, 'day');

	const days = [];
	for (let day = lastYear; day.isBefore(today) || day.isSame(today); day = day.add(1, 'day')) {
		const dateStr = day.format('YYYY-MM-DD');
		const contribution = contributions.find((c) => c.date === dateStr);
		days.push({
			date: dateStr,
			count: contribution ? contribution.count : 0,
			color: getColor(contribution ? contribution.count : 0)
		});
	}

	const weeks = [];
	for (let i = 0; i < days.length; i += 7) {
		weeks.push(days.slice(i, i + 7));
	}

	const months = [];
	const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	for (let i = 0; i < 12; i += 1) {
		const monthIndex = i + 1;
		months.push({
			name: monthNames[i],
			offset: weeks.findIndex((week) => week[0].date.split('-')[1] === monthIndex.toString().padStart(2, '0')) * 12
		});
	}

	return githubUsername ? (
		<div className={`w-full rounded-2xl border border-primary_border bg-content1 p-4 shadow-lg ${classNames}`}>
			<div className='flex flex-col gap-2 md:flex-row md:items-center'>
				<h1 className='flex items-center gap-4 text-base font-bold md:text-lg lg:text-xl'>
					GitHub Contributions
					<Link
						href='/'
						className='text-grey-500 ml-auto text-xs font-thin md:text-sm'
					>
						View Activity &gt;
					</Link>
				</h1>
				<span className='text-xs text-link md:ml-auto md:text-sm'>{totalContributionsCount} contributions in the last year</span>
			</div>
			{loading ? (
				<LoadingSpinner
					message='Fetching GitHub Contributions...'
					className='py-20'
				/>
			) : (
				<div className='w-full overflow-x-scroll lg:overflow-x-hidden'>
					<div className='mt-5 flex w-[200%] flex-col items-center rounded-lg border border-primary_border lg:w-full'>
						<svg
							className='w-full'
							viewBox='0 0 700 110'
						>
							<g transform='translate(50, 20)'>
								{months.map((month) => (
									<text
										key={month.name}
										x={month.offset <= 12 ? month.offset * 2 : month.offset}
										y='-5'
										className='fill-gray-500 text-[10px]'
									>
										{month.name}
									</text>
								))}
								{['Mon', 'Wed', 'Fri'].map((day, index) => (
									<text
										key={day}
										x='-10'
										y={index * 22 + 22}
										className='fill-gray-500 text-[10px]'
										textAnchor='end'
									>
										{day}
									</text>
								))}
								{weeks.map((week, weekIndex) => (
									<g
										// eslint-disable-next-line react/no-array-index-key
										key={weekIndex}
										transform={`translate(${weekIndex * 12}, 0)`}
									>
										{week.map((day, dayIndex) => (
											<Tooltip
												showArrow
												content={`${formatContributionDate(day)}`}
												key={day.date}
												className='text-xs'
											>
												<rect
													width='10'
													height='10'
													y={dayIndex * 12}
													className={`rounded-md ${day.color}`}
												/>
											</Tooltip>
										))}
									</g>
								))}
							</g>
						</svg>
					</div>
				</div>
			)}
		</div>
	) : (
		<div className='mt-[56px] w-full rounded-2xl border border-primary_border bg-content1 p-4 shadow-lg'>
			<div className='flex items-center justify-between'>
				<h2 className='text-lg font-semibold'>GitHub Contributions</h2>
				<button
					type='button'
					onClick={openProfileEdit}
					className='cursor-pointer font-semibold text-primary'
				>
					Link
				</button>
			</div>
			<div className='mt-5 flex flex-col items-center justify-center gap-5'>
				<Image
					src='/misc/empty-github-state.svg'
					alt='github icon'
					width={184}
					height={162.21}
				/>
				<p className='mt-2 text-center text-sm md:text-base'>
					<span className='text-primary'>Link</span> GitHub to view your contributions
				</p>
			</div>
		</div>
	);
}

export default ContributionGraph;
