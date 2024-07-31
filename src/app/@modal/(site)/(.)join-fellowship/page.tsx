// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import JoinFellowshipForm from '@/components/JoinFellowship/JoinFellowshipForm';
import { Button } from '@nextui-org/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Divider } from '@nextui-org/divider';
import { useUserDetailsContext } from '@/contexts';
import LinkWithNetwork from '@/components/Misc/LinkWithNetwork';

function JoinFellowshipModal() {
	const router = useRouter();
	const { id } = useUserDetailsContext();

	const joinFellowshipFormRef = useRef<HTMLFormElement>(null);

	const [isPreview, setIsPreview] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(true);

	const handleOnClose = () => {
		router.back();
	};

	const handleSubmit = () => {
		if (joinFellowshipFormRef.current) {
			joinFellowshipFormRef?.current?.requestSubmit(); // Call the submit function from the child component
		}
	};

	return (
		<Modal
			isOpen={isModalOpen}
			onClose={handleOnClose}
			size='4xl'
			scrollBehavior='inside'
			shouldBlockScroll
			className='bg-cardBg'
		>
			<ModalContent>
				{() =>
					id ? (
						<>
							<ModalHeader className='flex items-center gap-2 text-sm'>
								{isPreview ? (
									<>
										<Button
											color='primary'
											variant='light'
											isIconOnly
											onPress={() => setIsPreview(false)}
											className='h-[24px] w-[24px]'
										>
											<Image
												alt='back button'
												src='/icons/arrow-right-white.svg'
												width={24}
												height={24}
												className='rotate-180 invert dark:invert-0'
											/>
										</Button>

										<h3 className='font-semibold'>Application Request Preview</h3>
									</>
								) : (
									<>
										<Image
											alt='Join Fellowship Icon'
											src='/icons/add-user-grey-filled.svg'
											width={24}
											height={24}
											className='ml-[-8px] mr-2'
										/>
										<h3 className='font-semibold'>Join Fellowship</h3>
									</>
								)}
							</ModalHeader>
							<Divider />

							<ModalBody>
								<JoinFellowshipForm
									formRef={joinFellowshipFormRef}
									isPreview={isPreview}
									onSuccess={() => {
										setIsModalOpen(false);
									}}
								/>
							</ModalBody>

							<Divider />

							<ModalFooter>
								<Button
									color='primary'
									onPress={() => {
										if (!isPreview) {
											setIsPreview(true);
										} else {
											handleSubmit();
										}
									}}
									className='flex flex-1 rounded-3xl text-sm'
								>
									{isPreview ? (
										'Submit Application'
									) : (
										<>
											Preview Application Request
											<Image
												alt='Join Fellowship Icon'
												src='/icons/arrow-right-white.svg'
												width={20}
												height={20}
											/>
										</>
									)}
								</Button>
							</ModalFooter>
						</>
					) : (
						<div className='p-6 text-center'>
							Please{' '}
							<LinkWithNetwork
								href='/login'
								className='text-link'
							>
								login
							</LinkWithNetwork>{' '}
							to create an application request for fellowship
						</div>
					)
				}
			</ModalContent>
		</Modal>
	);
}

export default JoinFellowshipModal;
