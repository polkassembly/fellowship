// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { SingleStatus } from '@/global/types';
import { Divider } from '@nextui-org/divider';
import dayjs from '@/services/dayjs-init';
import React from 'react';
import StatusChip from '../../StatusChip';

interface Props {
	statusHistory?: SingleStatus[];
}

function Timeline({ statusHistory }: Props) {
	return (
		<div>
			<h5 className='mb-5 text-base font-bold'>Referendum</h5>
			<ul className='flex list-none flex-col gap-y-2'>
				{statusHistory?.map((data, idx) => {
					return (
						<>
							<li
								key={data.id}
								className='grid grid-cols-8'
							>
								<h6 className='col-span-3 text-sm'>{dayjs(data.timestamp).format("Do MMM 'YY, h:mm a")}</h6>
								<div className='col-span-5 text-sm text-gray-500'>
									<StatusChip status={data.status} />
								</div>
							</li>
							{idx < statusHistory.length - 1 ? <Divider /> : null}
						</>
					);
				})}
			</ul>
		</div>
	);
}

export default Timeline;
