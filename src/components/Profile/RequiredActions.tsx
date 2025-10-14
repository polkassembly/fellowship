// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { AlertTriangle, FileText, CheckCircle2, Award, Plus, Minus } from 'lucide-react';
import LinkWithNetwork from '../Misc/LinkWithNetwork';

interface Props {
	className?: string;
}

function RequiredActions({ className }: Props) {
	const [isAttentionExpanded, setIsAttentionExpanded] = useState(true);

	return (
		<Card className={`border-primary_border bg-cardBg p-3 ${className}`}>
			<CardHeader className='w-full'>
				<div className='flex w-full items-center justify-between'>
					<h3 className='flex items-center gap-2 font-semibold text-black dark:text-white'>
						<AlertTriangle className='h-5 w-5 text-orange-500' />
						Attention Required
					</h3>
					<button
						onClick={() => setIsAttentionExpanded(!isAttentionExpanded)}
						className='rounded p-1 transition-colors hover:bg-gray-100'
					>
						{isAttentionExpanded ? <Minus className='h-5 w-5 text-secondaryText' /> : <Plus className='h-5 w-5 text-secondaryText' />}
					</button>
				</div>
			</CardHeader>
			{isAttentionExpanded && (
				<CardBody>
					<div className='space-y-4'>
						{/* Evidence Submission Required */}
						<div className='flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 p-4'>
							<div className='flex items-center gap-3'>
								<FileText className='h-5 w-5 text-orange-600' />
								<div>
									<h4 className='font-semibold text-black dark:text-white'>Evidence submission required</h4>
									<p className='text-sm text-text_secondary'>For ongoing rank maintenance</p>
								</div>
							</div>
							<Button
								size='sm'
								className='bg-orange-500 font-medium text-white hover:bg-orange-600'
								as={LinkWithNetwork}
								href='/submit-evidence'
							>
								Submit Now
							</Button>
						</div>

						{/* Vote Needed */}
						<div className='flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4'>
							<div className='flex items-center gap-3'>
								<CheckCircle2 className='h-5 w-5 text-blue-600' />
								<div>
									<h4 className='font-semibold text-black dark:text-white'>Vote needed on 2 pending proposals</h4>
									<p className='text-sm text-text_secondary'>Treasury and governance proposals</p>
								</div>
							</div>
							<Button
								size='sm'
								variant='bordered'
								className='border-blue-500 font-medium text-blue-600 hover:bg-blue-50'
								as={LinkWithNetwork}
								href='/?feed=pending'
							>
								Review & Vote
							</Button>
						</div>

						{/* Member Grading */}
						<div className='flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50 p-4'>
							<div className='flex items-center gap-3'>
								<Award className='h-5 w-5 text-purple-600' />
								<div>
									<h4 className='font-semibold text-black dark:text-white'>Consider grading 4 junior members</h4>
									<p className='text-sm text-text_secondary'>Mentorship and evaluation tasks</p>
								</div>
							</div>
							<Button
								size='sm'
								variant='bordered'
								className='border-purple-500 font-medium text-purple-600 hover:bg-purple-50'
								as={LinkWithNetwork}
								href='/members'
							>
								Grade Members
							</Button>
						</div>
					</div>
				</CardBody>
			)}
		</Card>
	);
}

export default RequiredActions;
