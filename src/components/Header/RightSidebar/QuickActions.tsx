// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';
import { FileText, DollarSign, UserPlus, Plus } from 'lucide-react';
import { Button } from '@nextui-org/button';
import LinkWithNetwork from '../../Misc/LinkWithNetwork';

export default function QuickActions() {
	return (
		<div className='border-b border-primary_border p-4'>
			<h3 className='font-poppins mb-3 text-sm text-text_secondary'>Quick Actions</h3>
			<div className='grid grid-cols-2 gap-2'>
				<Button
					variant='bordered'
					className='font-poppins flex h-16 flex-col gap-1 border-primary_border text-text_secondary hover:bg-gray-50'
					as={LinkWithNetwork}
					href='/submit-evidence'
					startContent={<FileText className='h-4 w-4' />}
				>
					<span className='text-xs'>Submit Evidence</span>
				</Button>

				<Button
					variant='bordered'
					className='font-poppins flex h-16 flex-col gap-1 border-primary_border text-text_secondary hover:bg-gray-50'
					startContent={<DollarSign className='h-4 w-4' />}
				>
					<span className='text-xs'>Claim Salary</span>
				</Button>

				<Button
					variant='bordered'
					className='font-poppins flex h-16 flex-col gap-1 border-primary_border text-text_secondary hover:bg-gray-50'
					startContent={<UserPlus className='h-4 w-4' />}
				>
					<span className='text-xs'>Induct</span>
				</Button>

				<Button
					variant='bordered'
					className='font-poppins flex h-16 flex-col gap-1 border-primary_border text-text_secondary hover:bg-gray-50'
					as={LinkWithNetwork}
					href='/create-proposal'
					startContent={<Plus className='h-4 w-4' />}
				>
					<span className='text-xs'>Create Proposal</span>
				</Button>
			</div>
		</div>
	);
}
