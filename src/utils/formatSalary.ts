// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default function formatSalary(salary: string) {
	const salaryNumber = Math.abs(Number(salary));
	let formattedSalary = '';

	if (salaryNumber >= 1.0e9) {
		formattedSalary = `${(salaryNumber / 1.0e9).toFixed(2)}K`;
	} else if (salaryNumber >= 1.0e6) {
		formattedSalary = (salaryNumber / 1.0e6).toFixed(2);
	} else if (salaryNumber >= 1.0e3) {
		formattedSalary = (salaryNumber / 1.0e3).toFixed(2);
	} else {
		formattedSalary = salary;
	}

	return `${formattedSalary.toString()} USDT`;
}
