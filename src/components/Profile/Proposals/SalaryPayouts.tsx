// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table';
import React from 'react';
import { PayoutListingItem } from '@/global/types';

interface Props {
	payouts: PayoutListingItem[];
	className?: string;
}

function SalaryPayouts({ payouts, className }: Props) {
	return (
		<Table
			className={`${className}`}
			classNames={{
				wrapper: 'rounded-none border-none rounded-b-3xl shadow-none outline-none'
			}}
			aria-label='Payouts table'
			selectionMode='single'
			isHeaderSticky
		>
			<TableHeader>
				<TableColumn>Cycle</TableColumn>
				<TableColumn>Rank</TableColumn>
				<TableColumn>Amount</TableColumn>
				<TableColumn>Dispersed On</TableColumn>
				<TableColumn>&nbsp;</TableColumn>
			</TableHeader>

			<TableBody>
				{payouts.map((payout, idx) => (
					<TableRow
						key={payout.id}
						className='cursor-pointer'
					>
						<TableCell>{payout?.cycleIndex?.cycleIndex || idx}</TableCell>
						<TableCell>{5}</TableCell>
						<TableCell>{payout?.amount || idx}</TableCell>
						<TableCell>{5}</TableCell>
						<TableCell>{5}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

export default SalaryPayouts;
