// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export function formatContributionDate(day: { date: string; count: number; color: string }) {
	function getOrdinalSuffix(date: number) {
		if (date > 3 && date < 21) return `${date}th`;
		switch (date % 10) {
			case 1:
				return `${date}st`;
			case 2:
				return `${date}nd`;
			case 3:
				return `${date}rd`;
			default:
				return `${date}th`;
		}
	}

	const date = new Date(day.date);
	const dayWithSuffix = getOrdinalSuffix(date.getDate());
	const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${dayWithSuffix}`;
	return `${day.count} contributions on ${formattedDate}`;
}
