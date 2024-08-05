// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FELLOWS_REPO } from '@/global/constants/fellowsRepo';

export const getUserCommitHistory = async ({ username }: { username: string }) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let allCommits: any[] = [];
	let page = 1;
	const currentDate = new Date();
	const lastYearDate = new Date();
	lastYearDate.setFullYear(currentDate.getFullYear() - 1);
	lastYearDate.setDate(currentDate.getDate() + 1); // Include the current day last year

	let fetchMore = true;

	try {
		while (fetchMore) {
			// eslint-disable-next-line no-await-in-loop
			const data = await fetch(`https://api.github.com/repos/${FELLOWS_REPO}/commits?author=${username}&per_page=100&page=${page}`).then((res) => res.json());

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

		allCommits.forEach((commit) => {
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

		return {
			contributions: contributionsArray,
			totalContributionsCount: allCommits.length
		};
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
