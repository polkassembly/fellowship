// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import dayjs from '@/services/dayjs-init';
import { FELLOWS_REPO } from '@/global/constants/fellowsRepo';

export const getGithubMonthlyStats = async () => {
	const currentDate = dayjs();
	const currentMonth = currentDate.month() + 1; // Months are zero-based in JavaScript
	const [currentMonthFirstDay, currentMonthLastDay] = [dayjs().date(1), dayjs().endOf('month')];

	const previousMonth = currentMonth - 1 === 0 ? 12 : currentMonth - 1;
	const [previousMonthFirstDay, previousMonthLastDay] = [
		dayjs()
			.month(previousMonth - 1)
			.date(1),
		dayjs()
			.month(previousMonth - 1)
			.endOf('month')
	];

	const [currentMonthData, previousMonthData] = await Promise.all([
		fetch(`https://api.github.com/repos/${FELLOWS_REPO}/commits?per_page=100&since=${currentMonthFirstDay.toISOString()}&until=${currentMonthLastDay.toISOString()}`).then((res) =>
			res.json()
		),
		fetch(`https://api.github.com/repos/${FELLOWS_REPO}/commits?per_page=100&since=${previousMonthFirstDay.toISOString()}&until=${previousMonthLastDay.toISOString()}`).then(
			(res) => res.json()
		)
	]);

	const currentMonthCommits = currentMonthData || [];
	const previousMonthCommits = previousMonthData || [];

	const currentMonthCommitsCount = currentMonthCommits.length;
	const previousMonthCommitsCount = previousMonthCommits.length;
	const percentageDifference = ((currentMonthCommitsCount - previousMonthCommitsCount) / previousMonthCommitsCount) * 100;

	return {
		totalContributionsCount: currentMonthCommitsCount,
		percentageDifference: Math.abs(percentageDifference).toFixed(1),
		isIncrease: currentMonthCommitsCount > previousMonthCommitsCount
	};
};
