// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal';
import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import { RFCPullRequestItem } from '@/global/types';
import Address from '../Profile/Address';
import LinkWithNetwork from '../Misc/LinkWithNetwork';

interface Props {
	successDetails: { proposer: string; postId: string | number; requestType: string; prItem: RFCPullRequestItem };
}

function CreateRFCProposalSuccessModal({ successDetails }: Props) {
	const router = useRouter();

	const handleOnClose = () => {
		router.back();
	};

	return (
		<Modal
			isOpen
			size='xl'
			onClose={handleOnClose}
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
							<span className='text-xl font-semibold text-white'>Proposal Submitted Successfully</span>
						</ModalHeader>

						<ModalBody>
							<div className='flex flex-col items-center justify-center gap-4 p-6 text-sm'>
								<div className='grid w-[60%] grid-cols-2 grid-rows-4 gap-x-2 gap-y-2'>
									<div>Proposer Address:</div>
									<div className='font-medium'>
										<Address
											variant='inline'
											address={successDetails.proposer}
											truncateCharLen={4}
										/>
									</div>

									<div>RFC Request Type:</div>
									<div className='font-medium'>{successDetails.requestType}</div>

									<div>Pull Request:</div>
									<div className='font-medium'>
										<a
											href={successDetails.prItem.url}
											rel='noopener noreferrer'
											className='text-link underline'
										>
											#{successDetails.prItem.id}
										</a>
									</div>
								</div>

								<div className='flex items-center justify-center'>
									To see the proposal submitted click&nbsp;
									<LinkWithNetwork
										className='text-link underline'
										href={`/referenda/${successDetails.postId}`}
										target='_blank'
										rel='noopener noreferrer'
									>
										here
									</LinkWithNetwork>
								</div>

								{/* TODO: Add Social Icons */}
							</div>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

export default CreateRFCProposalSuccessModal;
