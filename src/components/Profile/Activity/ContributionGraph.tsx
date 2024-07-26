// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';

function ContributionGraph() {
	const [contributions, setContributions] = useState<any[]>([]);
	const [totalContributionsCount, setTotalContributionsCount] = useState<number>(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const getColor = (count: number) => {
		if (count === 0) return 'fill-contributionEmpty';
		if (count < 5) return 'fill-contributionSm';
		if (count < 10) return 'fill-contributionMd';
		if (count < 20) return 'fill-contributionLg';
		return 'fill-contributionXl';
	};

	const author = 'adetoye-dev';
	const repo = 'polkassembly/polkassembly';

	useEffect(() => {
		const fetchContributions = async () => {
			try {
				setLoading(true);
				let allCommits: any[] = [];
				let page = 1;
				const currentDate = new Date();
				const lastYearDate = new Date();
				lastYearDate.setFullYear(currentDate.getFullYear() - 1);
				lastYearDate.setDate(currentDate.getDate() + 1);

				let fetchMore = true;

				while (fetchMore) {
					// eslint-disable-next-line no-await-in-loop
					const data = await fetch(`https://api.github.com/repos/${repo}/commits?author=${author}&per_page=100&page=${page}`).then((res) => res.json());

					if (!data.length) break;

					const lastCommitDate = new Date(data[data.length - 1].commit.author.date);

					allCommits = [...allCommits, ...data];

					// Check if the last commit is still within the last year
					if (lastCommitDate < lastYearDate) {
						fetchMore = false;
					}

					page += 1;
				}

				// Filter out commits outside the last year range
				allCommits = allCommits.filter((commit) => new Date(commit.commit.author.date) >= lastYearDate);

				const contributionsCount: { [key: string]: number } = {};

				allCommits.forEach((commit: any) => {
					const date = new Date(commit.commit.author.date).toISOString().split('T')[0];
					if (!contributionsCount[date]) {
						contributionsCount[date] = 0;
					}
					contributionsCount[date] += 1;
				});

				const contributionsArray = Object.entries(contributionsCount).map(([date, count]) => ({
					date,
					count
				}));

				setContributions(contributionsArray);
				setTotalContributionsCount(allCommits.length);
			} catch (error) {
				setError((error as Error)?.message);
			} finally {
				setLoading(false);
			}
		};

		fetchContributions();
	}, [author, repo]);

	if (error) return <p>Error: {error}</p>;

	const today = new Date();
	const lastYear = new Date(today);
	lastYear.setFullYear(today.getFullYear() - 1);
	lastYear.setDate(today.getDate() + 1);

	const days = [];
	for (let day = new Date(lastYear); day <= today; day.setDate(day.getDate() + 1)) {
		const dateStr = day.toISOString().split('T')[0];
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

	return (
		<div className='w-full rounded-2xl border border-primary_border bg-content1 p-4 shadow-lg'>
			<div className='flex flex-col gap-2 md:flex-row md:items-center'>
				<h1 className='flex items-center gap-4 text-xl font-bold'>
					GitHub Contributions
					<Link
						href='/'
						className='text-grey-500 text-sm font-thin'
					>
						View Activity &gt;
					</Link>
				</h1>
				<span className='text-sm text-link md:ml-auto'>{totalContributionsCount} contributions in the last year</span>
			</div>
			{loading ? (
				<LoadingSpinner
					message='Fetching GitHub Contributions...'
					className='py-20'
				/>
			) : (
				<div className='mt-5 flex w-full flex-col items-center rounded-lg border border-primary_border'>
					<svg
						className='w-full'
						viewBox='0 0 700 110'
					>
						<g transform='translate(50, 20)'>
							{months.map((month) => (
								<text
									key={month.name}
									x={month.offset <= 12 ? month.offset * 5 : month.offset + 48}
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
										<rect
											key={day.date}
											width='10'
											height='10'
											y={dayIndex * 12}
											// style={{ fill: day.color }}
											className={`rounded-md ${day.color}`}
										/>
									))}
								</g>
							))}
						</g>
					</svg>
				</div>
			)}
		</div>
	);
}

export default ContributionGraph;
