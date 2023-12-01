// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Divider } from '@nextui-org/divider';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { useRouter, useSearchParams } from 'next/navigation';
import PostDataContextProvider from '@/contexts/PostDataContext';
import { VoteDecisionType, IPost, ProposalType, ActivityType } from '@/global/types';
import { Button } from '@nextui-org/button';
import Image from 'next/image';
import VoteButton from '@/components/Post/GovernanceSidebar/VoteButton';
import { useEffect, useState } from 'react';
import VOTABLE_STATUSES from '@/global/constants/votableStatuses';
import ContentListingHeader from './ContentListingHeader';
import PostTags from './PostTags';
import Markdown from '../TextEditor/Markdown';
import HorizontalVoteProgress from './HorizontalVoteProgress';
import VoteModal from './GovernanceSidebar/VoteModal';

interface Props {
	post: IPost;
}

function PostModal({ post }: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [voteModalType, setVoteModalType] = useState<VoteDecisionType | null>(null);

	const handleOnClose = () => {
		router.back();
	};

	const reloadPage = () => {
		// to disable itercepting route
		window.location.reload();
	};

	const canVote = post.on_chain_info?.status && VOTABLE_STATUSES.includes(post.on_chain_info?.status);

	useEffect(() => {
		const vote = searchParams.get('vote');
		if (vote !== 'true') return;
		setVoteModalType(VoteDecisionType.AYE);
	}, [router, searchParams]);

	return (
		<PostDataContextProvider postItem={post}>
			<Modal
				isOpen
				onClose={handleOnClose}
				size='5xl'
				scrollBehavior='inside'
				shouldBlockScroll
			>
				<ModalContent>
					{() => (
						<>
							<ModalHeader className='flex justify-between'>
								<header className='flex flex-col gap-2 text-xl font-semibold'>
									<ContentListingHeader
										createdAt={post.created_at}
										address={post.inductee_address || post.on_chain_info?.proposer}
										status={post.on_chain_info?.status}
										activityType={post.inductee_address ? ActivityType.INDUCTION : undefined}
									/>

									<section className='mt-1 flex gap-2'>
										<p className='mt-0.5 text-base font-normal text-slate-500'>#{post.id}</p>
										<article className='flex flex-col gap-1'>
											<h2 className='text-xl font-semibold'>{post.title}</h2>
											{post.tags.length > 0 && <PostTags tags={post.tags} />}
										</article>
									</section>
								</header>

								<Button
									onPress={reloadPage}
									color='primary'
									variant='light'
									radius='full'
									isIconOnly
									className='absolute right-9 top-1 max-h-[32px] min-h-[32px] min-w-[32px] max-w-[32px]'
								>
									<Image
										alt='back button'
										src='/icons/full-screen-gray.svg'
										width={18}
										height={18}
									/>
								</Button>
							</ModalHeader>

							<Divider />

							<ModalBody className='p-6'>{post.content && <Markdown md={post.content} />}</ModalBody>

							{post.proposalType !== ProposalType.DISCUSSIONS && (
								<>
									<Divider />
									<ModalFooter className='flex flex-col gap-3'>
										<div className='flex items-center justify-start gap-3'>
											<h2 className='text-base font-medium'>Voting Status</h2>
											<HorizontalVoteProgress className='w-[184px]' />
										</div>

										{canVote && (
											<div className='flex items-center gap-4'>
												<VoteButton
													voteType={VoteDecisionType.AYE}
													onClick={() => setVoteModalType(VoteDecisionType.AYE)}
												/>
												<VoteButton
													voteType={VoteDecisionType.NAY}
													onClick={() => setVoteModalType(VoteDecisionType.NAY)}
												/>
											</div>
										)}
									</ModalFooter>
								</>
							)}
						</>
					)}
				</ModalContent>
			</Modal>

			{post.proposalType !== ProposalType.DISCUSSIONS && (
				<VoteModal
					isModalOpen={voteModalType !== null}
					defaultVoteType={voteModalType ?? VoteDecisionType.AYE}
					closeModal={() => setVoteModalType(null)}
				/>
			)}
		</PostDataContextProvider>
	);
}

export default PostModal;
