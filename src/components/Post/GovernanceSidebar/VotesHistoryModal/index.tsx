// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable security/detect-object-injection */
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Tabs, Tab } from '@nextui-org/tabs';
import { Pagination } from '@nextui-org/pagination';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Divider } from '@nextui-org/divider';
import { useApiContext, usePostDataContext } from '@/contexts';
import getPostVotes from '@/app/api/v1/[proposalType]/[id]/votes/getPostVotes';
import { ProposalType, Vote } from '@/global/types';
import getOriginUrl from '@/utils/getOriginUrl';
import AddressInline from '@/components/Profile/Address/AddressInline';
import { VOTES_LISTING_LIMIT } from '@/global/constants/listingLimit';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';

interface Props {
	isModalOpen: boolean;
	closeModal: () => void;
}

function VotesHistoryModal({ isModalOpen, closeModal }: Props) {
	const [decision, setDecision] = useState<'yes' | 'no'>('yes');
	const [page, setPage] = useState(1);
	const { network } = useApiContext();
	const [loading, setLoading] = useState(false);
	const {
		postData: { id, on_chain_info: onChainInfo }
	} = usePostDataContext();
	const [votesMap, setVotesMap] = useState<{
		yes: Vote[];
		no: Vote[];
	}>({
		yes: [],
		no: []
	});

	useEffect(() => {
		(async () => {
			const originUrl = getOriginUrl();
			setLoading(true);
			try {
				const votes = await getPostVotes({
					id,
					proposalType: ProposalType.FELLOWSHIP_REFERENDUMS,
					originUrl,
					page,
					network
				});
				setVotesMap(votes);
			} catch (error) {
				//
			}
			setLoading(false);
		})();
	}, [id, page, network]);

	const votes = useMemo(() => {
		// eslint-disable-next-line security/detect-object-injection
		return votesMap[decision] || [];
	}, [votesMap, decision]);

	return (
		<Modal
			isOpen={isModalOpen}
			onClose={closeModal}
			size='xl'
			scrollBehavior='inside'
			shouldBlockScroll
			isDismissable={false}
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className='flex items-center gap-2 text-sm'>
							<Image
								alt='Vote history'
								src='/icons/post/vote_history.svg'
								width={24}
								height={24}
								className='mr-0'
							/>
							<h3 className='text-base font-semibold'>Vote History</h3>
						</ModalHeader>
						<Divider />

						<ModalBody className='p-6'>
							<div className='flex w-full flex-col gap-y-5'>
								<Tabs
									size='md'
									fullWidth
									aria-label='Options'
									className='flex w-full items-center'
									onSelectionChange={(key) => {
										if (key === 'yes') {
											setDecision('yes');
										} else {
											setDecision('no');
										}
									}}
								>
									<Tab
										key='yes'
										title='Yes'
									/>
									<Tab
										key='no'
										title='No'
									/>
								</Tabs>
								{votes.length !== 0 ? (
									<section className='flex flex-col gap-y-5'>
										<article className='grid grid-cols-6'>
											<h4 className='col-span-4 text-sm font-medium'>Voter</h4>
											<h4 className='col-span-2 text-sm font-medium'>Amount</h4>
										</article>
										{votes?.map((vote, idx) => {
											return (
												<article
													className='grid grid-cols-6'
													key={vote.voter + idx.toString()}
												>
													<AddressInline
														maxCharacters={10}
														address={vote.voter}
														className='col-span-4'
													/>
													<h4 className='col-span-2 text-sm font-medium'>{vote.balance?.value}</h4>
												</article>
											);
										})}
									</section>
								) : loading ? (
									<div className='flex min-h-[300px] items-center justify-center text-base font-medium'>
										<LoadingSpinner message='Fetching votes...' />
									</div>
								) : (
									<div className='flex min-h-[300px] items-center justify-center text-base font-medium'>No Votes Found</div>
								)}
							</div>
						</ModalBody>
						{Math.ceil((onChainInfo?.total_votes?.[decision] || 0) / VOTES_LISTING_LIMIT) > 1 ? (
							<>
								<Divider />
								<ModalFooter>
									<Pagination
										total={Math.ceil((onChainInfo?.total_votes?.[decision] || 0) / VOTES_LISTING_LIMIT)}
										initialPage={1}
										page={page}
										onChange={(p) => setPage(p)}
									/>
								</ModalFooter>
							</>
						) : null}
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

export default VotesHistoryModal;
