// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useState, useEffect } from 'react';
import { Select, SelectItem } from '@nextui-org/select';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

interface Evidence {
	id: string;
	title: string;
	content: string;
	createdAt: string;
}

interface Props {
	readonly selectedEvidenceId?: string;
	readonly onEvidenceSelect: (evidenceId: string | null) => void;
	readonly disabled?: boolean;
	readonly className?: string;
}

function EvidenceSelector({ selectedEvidenceId, onEvidenceSelect, disabled = false, className = '' }: Props) {
	const router = useRouter();
	const [evidences, setEvidences] = useState<Evidence[]>([]);
	const [loading, setLoading] = useState(true);

	// Mock data for now - in real implementation, this would fetch from API
	useEffect(() => {
		const fetchEvidences = async () => {
			setLoading(true);
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Mock evidences - in real implementation, fetch from API
			const mockEvidences: Evidence[] = [
				{
					id: '1',
					title: 'Polkadot Core Development Contributions',
					content: 'Led development of key Polkadot runtime modules...',
					createdAt: '2024-01-15'
				},
				{
					id: '2',
					title: 'Substrate Framework Improvements',
					content: 'Implemented significant improvements to Substrate framework...',
					createdAt: '2024-01-10'
				},
				{
					id: '3',
					title: 'Community Education and Documentation',
					content: 'Created comprehensive documentation and educational materials...',
					createdAt: '2024-01-05'
				}
			];

			setEvidences(mockEvidences);
			setLoading(false);
		};

		fetchEvidences();
	}, []);

	const handleAddNewEvidence = () => {
		// Navigate to submit evidence with return URL
		const currentUrl = window.location.pathname;
		router.push(`/submit-evidence?returnTo=${encodeURIComponent(currentUrl)}`);
	};

	const selectedEvidence = evidences.find((e) => e.id === selectedEvidenceId);

	return (
		<div className={`space-y-3 ${className}`}>
			<div className='mb-1 text-xs font-normal'>
				Evidence<span className='text-base text-rose-500'>*</span>
			</div>

			<Select
				placeholder={loading ? 'Loading evidences...' : 'Select evidence or add new'}
				selectedKeys={selectedEvidenceId ? [selectedEvidenceId] : []}
				onSelectionChange={(keys) => {
					const selectedKey = Array.from(keys)[0] as string;
					if (selectedKey === 'add-new') {
						handleAddNewEvidence();
					} else {
						onEvidenceSelect(selectedKey || null);
					}
				}}
				className='w-full'
				variant='bordered'
				radius='sm'
				classNames={{
					trigger: 'border-primary_border border-1'
				}}
				disabled={disabled || loading}
				items={[...evidences, { id: 'add-new', title: 'Add new evidence', content: '', createdAt: '' }]}
			>
				{(item) => {
					if (item.id === 'add-new') {
						return (
							<SelectItem
								key='add-new'
								value='add-new'
								textValue='Add new evidence'
							>
								<div className='flex items-center gap-2 text-primary'>
									<Plus className='h-4 w-4' />
									<span className='font-medium'>Add new evidence</span>
								</div>
							</SelectItem>
						);
					}

					return (
						<SelectItem
							key={item.id}
							value={item.id}
							textValue={item.title}
						>
							<div className='flex flex-col'>
								<span className='font-medium'>{item.title}</span>
								<span className='text-xs text-text_secondary'>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
							</div>
						</SelectItem>
					);
				}}
			</Select>

			{selectedEvidence && (
				<div className='rounded-lg border border-primary_border bg-gray-50 p-3 dark:bg-gray-800'>
					<div className='mb-2 text-sm font-medium'>{selectedEvidence.title}</div>
					<div className='mb-2 text-xs text-text_secondary'>Created: {new Date(selectedEvidence.createdAt).toLocaleDateString()}</div>
					<div className='line-clamp-3 text-sm text-text_secondary'>{selectedEvidence.content}</div>
				</div>
			)}

			{evidences.length === 0 && !loading && (
				<div className='py-4 text-center'>
					<p className='mb-3 text-sm text-text_secondary'>No evidences found</p>
					<Button
						size='sm'
						color='primary'
						onPress={handleAddNewEvidence}
						startContent={<Plus className='h-4 w-4' />}
						className='bg-primary_accent'
					>
						Create your first evidence
					</Button>
				</div>
			)}
		</div>
	);
}

export default EvidenceSelector;
