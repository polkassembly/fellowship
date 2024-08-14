// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import dayjs from '@/services/dayjs-init';
import { FELLOWS_REPO } from '@/global/constants/fellowsRepo';

export const getUserCommitHistory = async ({ username }: { username: string }) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let allCommits: any[] = [];
	let page = 1;
	const currentDate = dayjs();
	const lastYearDate = currentDate.subtract(1, 'year').add(1, 'day');

	let fetchMore = true;

	try {
		while (fetchMore) {
			// eslint-disable-next-line no-await-in-loop
			const data = await fetch(`https://api.github.com/repos/${FELLOWS_REPO}/commits?author=${username}&per_page=100&page=${page}`).then((res) => res.json());

			if (!data.length) break;

			const lastCommitDate = dayjs(data[data.length - 1].commit.author.date);

			allCommits = [...allCommits, ...data];

			if (lastCommitDate.isBefore(lastYearDate)) {
				fetchMore = false;
			}

			page += 1;
		}

		allCommits = allCommits.filter((commit) => dayjs(commit.commit.author.date).isSame(lastYearDate, 'day') || dayjs(commit.commit.author.date).isAfter(lastYearDate, 'day'));

		const contributionsCount: { [key: string]: number } = {};

		allCommits.forEach((commit) => {
			const date = dayjs(commit.commit.author.date).format('YYYY-MM-DD');
			if (!contributionsCount[date]) {
				contributionsCount[date] = 0;
			}
			contributionsCount[date] += 1;
		});

		const contributionsArray = Object.entries(contributionsCount).map(([date, count]) => ({
			date,
			count
		}));

		return {
			contributions: contributionsArray,
			totalContributionsCount: allCommits.length
		};
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
