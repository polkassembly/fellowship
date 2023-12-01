// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table';
import React from 'react';
import dayjs from '@/services/dayjs-init';
import { PayoutListingItem } from '@/global/types';
import Claim from './Claim';

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
				{payouts.map((payout) => (
					<TableRow key={payout.id}>
						<TableCell>{payout?.salaryCycle?.cycleIndex !== undefined && payout?.salaryCycle?.cycleIndex !== null ? payout?.salaryCycle?.cycleIndex : -1}</TableCell>
						<TableCell>{payout?.otherActions?.rank}</TableCell>
						<TableCell>{payout?.amount || '--'}</TableCell>
						<TableCell>{payout?.type === 'Payout' ? dayjs(payout?.otherActions?.createdAtBlock).format('DD MMM YYYY') : '--'}</TableCell>
						<TableCell>
							<Claim showClaimButton={payout?.otherActions?.showClaimButton} />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

export default SalaryPayouts;
