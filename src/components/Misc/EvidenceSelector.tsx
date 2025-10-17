// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useState, useEffect } from 'react';
import { Select, SelectItem } from '@nextui-org/select';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import { SubsquidActivityType } from '@/global/types';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import nextApiClientFetch from '@/utils/nextApiClientFetch';

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
	const { network } = useApiContext();
	const { addresses } = useUserDetailsContext();
	const [evidences, setEvidences] = useState<Evidence[]>([]);
	const [loading, setLoading] = useState(true);

	// Fetch user's evidences from API
	useEffect(() => {
		const fetchEvidences = async () => {
			if (!addresses || addresses.length === 0) {
				setLoading(false);
				return;
			}

			setLoading(true);

			try {
				const userAddress = getSubstrateAddress(addresses[0]);

				// Fetch user activity to get evidences
				const { data, error } = await nextApiClientFetch<{ data: any[] }>({
					url: `api/v1/address/${userAddress}/activity?page=1`,
					network,
					isPolkassemblyAPI: false
				});

				if (error || !data) {
					console.error('Error fetching evidences:', error);
					setEvidences([]);
					setLoading(false);
					return;
				}

				// Filter for evidence submissions
				const evidenceActivities = (data.data || []).filter(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(activity: any) => activity.activityType === SubsquidActivityType.EvidenceSubmitted
				);

				// Transform to Evidence format
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const transformedEvidences: Evidence[] = evidenceActivities.map((activity: any) => ({
					id: activity.id || String(activity.otherActions?.createdAtBlock || Date.now()),
					title: `Evidence Submission - Rank ${activity.otherActions?.rank || 'Unknown'}`,
					content: activity.otherActions?.evidence || '',
					createdAt: activity.otherActions?.createdAt || new Date().toISOString()
				}));

				setEvidences(transformedEvidences);
			} catch (error) {
				console.error('Error fetching evidences:', error);
				setEvidences([]);
			} finally {
				setLoading(false);
			}
		};

		fetchEvidences();
	}, [addresses, network]);

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
		</div>
	);
}

export default EvidenceSelector;
