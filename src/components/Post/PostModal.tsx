// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Divider } from '@nextui-org/divider';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { useRouter } from 'next/navigation';
import PostDataContextProvider from '@/contexts/PostDataContext';
import { IPost } from '@/global/types';
import { Button } from '@nextui-org/button';
import Image from 'next/image';
import PostListingHeader from './PostListingHeader';
import PostTags from './PostTags';
import Markdown from '../TextEditor/Markdown';
import HorizontalVoteProgress from './HorizontalVoteProgress';

interface Props {
	post: IPost;
}

function PostModal({ post }: Props) {
	const router = useRouter();

	const handleOnClose = () => {
		router.back();
	};

	const reloadPage = () => {
		// to disable itercepting route
		window.location.reload();
	};

	return (
		<Modal
			isOpen
			onClose={handleOnClose}
			size='5xl'
			scrollBehavior='inside'
			shouldBlockScroll
		>
			<ModalContent>
				{() => (
					<PostDataContextProvider postItem={post}>
						<ModalHeader className='flex justify-between'>
							<header className='flex flex-col gap-2 text-xl font-semibold'>
								<PostListingHeader
									createdAt={post.created_at}
									address={post.on_chain_info?.proposer}
									status={post.on_chain_info?.status}
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

						<Divider />

						<ModalFooter className='flex flex-col gap-3'>
							<div className='flex items-center justify-start gap-3'>
								<h2 className='text-base font-medium'>Voting Status</h2>
								<HorizontalVoteProgress className='w-[184px]' />
							</div>

							<div className='flex items-center gap-4'>
								<Button
									className='flex w-full items-center gap-1.5 rounded-full bg-voteAye text-base text-white'
									size='sm'
								>
									<Image
										alt='Login Icon'
										src='/icons/thumbs-up-white.svg'
										width={16}
										height={16}
										className='ml-[-8px] mr-2 h-[40px]'
									/>
									Vote Aye
								</Button>

								<Button
									className='flex w-full items-center gap-1.5 rounded-full bg-voteNay text-base text-white'
									size='sm'
								>
									<Image
										alt='Login Icon'
										src='/icons/thumbs-up-white.svg'
										width={16}
										height={16}
										className='ml-[-8px] mr-2 h-[40px]'
									/>
									Vote Nay
								</Button>
							</div>
						</ModalFooter>
					</PostDataContextProvider>
				)}
			</ModalContent>
		</Modal>
	);
}

export default PostModal;
