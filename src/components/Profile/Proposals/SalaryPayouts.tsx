// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table';
import React from 'react';
import Image from 'next/image';
import dayjs from '@/services/dayjs-init';
import { PayoutListingItem } from '@/global/types';
import Rank from '@/components/Members/Rank';
import formatSalary from '@/utils/formatSalary';

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
						<TableCell>{payout?.type === 'Payout' ? payout?.cycleIndex?.cycleIndex : payout?.salaryCycle?.cycleIndex}</TableCell>
						<TableCell>{payout?.type === 'Payout' ? <Rank rank={payout?.rank} /> : <Rank rank={payout?.otherActions?.rank} />}</TableCell>
						<TableCell>{payout?.type === 'Payout' ? formatSalary(payout?.amount) : formatSalary(payout?.otherActions?.amount)}</TableCell>
						<TableCell>
							<div className='flex items-center gap-1'>
								<Image
									alt='icon'
									src='/icons/clock.svg'
									width={16}
									height={16}
									className='dark:grayscale dark:invert'
								/>
								{payout?.type === 'Payout' ? dayjs(payout?.createdAt).format('DD MMM YYYY') : dayjs(payout?.otherActions?.createdAt).format('DD MMM YYYY')}
							</div>
						</TableCell>
						<TableCell>
							{payout?.type === 'Payout' ? (
								<Image
									alt='icon'
									src='/icons/arrow-circle-up-right.svg'
									width={24}
									height={24}
									className='dark:grayscale dark:invert'
								/>
							) : (
								<button
									type='button'
									className='flex cursor-pointer items-center justify-center border-none bg-none outline-none disabled:cursor-not-allowed'
								>
									<Image
										alt='Claim Icon'
										src='/icons/claim.svg'
										width={24}
										height={24}
										className='dark:dark-icon-filter'
									/>
								</button>
							)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

export default SalaryPayouts;
