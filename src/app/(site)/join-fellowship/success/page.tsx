// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import LinkWithNetwork from '@/components/Misc/LinkWithNetwork';
import { ServerComponentProps } from '@/global/types';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

type SearchParamProps = {
	postId: string;
};

function JoinFellowshipApplicationSuccessModal({ searchParams }: ServerComponentProps<unknown, SearchParamProps>) {
	const { postId } = searchParams ?? {};
	const router = useRouter();

	const handleClose = () => {
		router.back();
	};

	return (
		<Modal
			isOpen
			size='xl'
			onClose={handleClose}
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className='flex items-center gap-3 bg-successModalHeaderBg'>
							<div className='flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white'>
								<Image
									alt='Success Icon'
									src='/icons/check-green.svg'
									width={12}
									height={8}
								/>
							</div>
							<span className='text-sm font-semibold'>Application Request Submitted Successfully</span>
						</ModalHeader>

						{postId && (
							<ModalBody>
								<p className='p-7 text-center text-sm'>
									To see the current status of the application request{' '}
									<LinkWithNetwork
										className='text-link'
										href={`/post/${postId}`}
									>
										click here
									</LinkWithNetwork>
								</p>
							</ModalBody>
						)}
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

export default JoinFellowshipApplicationSuccessModal;
