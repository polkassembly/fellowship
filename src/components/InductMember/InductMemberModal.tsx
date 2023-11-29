// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { useUserDetailsContext } from '@/contexts';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Divider } from '@nextui-org/divider';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';
import { IPost } from '@/global/types';
import PostDataContextProvider from '@/contexts/PostDataContext';
import InductMemberForm from './InductMemberForm';
import InductMemberSuccessModal from './InductMemberSuccessModal';
import LinkWithNetwork from '../Misc/LinkWithNetwork';

interface Props {
	post: IPost;
}

function InductMemberModal({ post }: Props) {
	const router = useRouter();
	const { id } = useUserDetailsContext();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const formRef = useRef<any>(null);

	const [setsubmitBtnText, setSetsubmitBtnText] = useState('Next Step');
	const [successDetails, setSuccessDetails] = useState({
		proposer: '',
		inductee: '',
		preimageHash: '',
		preimageLength: 0,
		postId: 0
	});

	const handleOnClose = () => {
		router.back();
	};

	const handleNextStep = () => {
		formRef?.current?.nextStep?.();
	};

	if (successDetails.proposer) {
		return <InductMemberSuccessModal successDetails={successDetails} />;
	}

	return (
		<Modal
			isOpen
			onClose={handleOnClose}
			size='4xl'
			scrollBehavior='outside'
			backdrop='blur'
		>
			<ModalContent>
				{() =>
					id ? (
						<>
							<ModalHeader className='flex items-center gap-2 text-sm'>
								<Image
									alt='Join Fellowship Icon'
									src='/icons/add-user-grey-filled.svg'
									width={24}
									height={24}
									className='ml-[-8px] mr-2'
								/>
								<h3 className='font-semibold'>Member Induction</h3>
							</ModalHeader>
							<Divider />

							<ModalBody>
								<PostDataContextProvider postItem={post}>
									<InductMemberForm
										ref={formRef}
										setSetsubmitBtnText={setSetsubmitBtnText}
										setSuccessDetails={setSuccessDetails}
									/>
								</PostDataContextProvider>
							</ModalBody>

							<Divider />

							<ModalFooter>
								<Button
									color='primary'
									className='flex flex-1 text-sm'
									onPress={handleNextStep}
								>
									{setsubmitBtnText}
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
							to induct a member to the Fellowship.
						</div>
					)
				}
			</ModalContent>
		</Modal>
	);
}

export default InductMemberModal;
