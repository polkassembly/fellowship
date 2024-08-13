// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/modal';
import { CHANNEL } from '@/global/types';
import Image from 'next/image';
import { useUserDetailsContext } from '@/contexts';
import { Button } from '@nextui-org/button';
import queueNotification from '@/utils/queueNotification';

type Props = {
	title: string;
	open: boolean;
	getVerifyToken: (channel: CHANNEL) => Promise<string | undefined>;
	generatedToken?: string;
	onClose: () => void;
};

function CopyIcon({ className }: { className: string }) {
	return (
		<Image
			src='/icons/content-copy.svg'
			width={20}
			height={20}
			alt='clipboard copy icon'
			className={`inline ${className}`}
		/>
	);
}

function TelegramInfoModal({ title, open, getVerifyToken, generatedToken = '', onClose }: Props) {
	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState(generatedToken);
	const { username } = useUserDetailsContext();
	const handleGenerateToken = async () => {
		setLoading(true);
		const data = await getVerifyToken(CHANNEL.TELEGRAM);
		if (!data) {
			queueNotification({ message: 'Error generating token', header: 'Error', status: 'error' });
			setLoading(false);
			return;
		}
		setToken(data);
		setLoading(false);
	};

	const handleCopyClicked = (text: string) => {
		navigator.clipboard.writeText(text);
		queueNotification({ message: 'Copied', header: 'success' });
	};

	return (
		<Modal
			isOpen={open}
			onClose={onClose}
			className='text-sm'
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className='flex gap-2 border border-primary_border text-xl font-semibold'>
							<Image
								alt='Login Icon'
								src='/icons/settings/telegram.svg'
								width={24}
								height={24}
								className='ml-[-8px] mr-2 dark:grayscale dark:invert'
							/>
							{title}
						</ModalHeader>

						<ModalBody>
							<div className=''>
								<ol>
									<li className='list-inside leading-[40px] dark:text-white'>
										Click this invite link
										<span className='bg-bg-secondary border-text_secondary text-pink_primary dark:text-blue-dark-helper mx-2 rounded-md border border-solid p-1'>
											<a
												href='https://t.me/PolkassemblyBot'
												target='_blank'
												rel='noreferrer'
											>
												t.me/PolkassemblyBot
											</a>
										</span>
										<br />
										or Add
										<button
											type='button'
											onClick={() => handleCopyClicked('@PolkassemblyBot')}
											className='bg-bg-secondary border-text_secondary text-pink_primary dark:text-blue-dark-helper mx-2 cursor-pointer rounded-md border border-solid p-1'
										>
											<CopyIcon className='dark:grayscale dark:invert' /> @PolkassemblyBot
										</button>
										to your Telegram Chat as a member
									</li>
									<li className='list-inside leading-[40px] dark:text-white'>
										Send this command to the chat with the bot:
										<br />
										<button
											type='button'
											onClick={() => handleCopyClicked('/add <username> <verificationToken>')}
											className='bg-bg-secondary border-text_secondary text-pink_primary dark:text-blue-dark-helper mx-2 cursor-pointer rounded-md border border-solid p-1'
										>
											<CopyIcon className='dark:grayscale dark:invert' /> {'<username>'} {'<verificationToken>'}
										</button>
										<div className='mt-4 flex justify-end'>
											<Button
												isLoading={loading}
												onClick={handleGenerateToken}
												color='primary'
											>
												Generate Token
											</Button>
										</div>
										<br />
										{token && (
											<div className='flex items-center dark:text-white'>
												<span>Username & Verification Token: </span>
												<button
													type='button'
													onClick={() => handleCopyClicked(`/add ${username} ${token}`)}
													className='bg-bg-secondary border-text_secondary text-pink_primary dark:text-blue-dark-helper mx-2 flex h-[30px] max-w-[230px] cursor-pointer items-center rounded-md border border-solid p-0'
												>
													<CopyIcon className='dark:grayscale dark:invert' />{' '}
													<span className='mr-2 inline-block max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap'>{username}</span>
													<span className='inline-block max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap'>{token}</span>
												</button>
											</div>
										)}
									</li>
									<li className='list-inside dark:text-white'>
										(Optional) Send this command to get help:
										<button
											type='button'
											onClick={() => handleCopyClicked('/start')}
											className='bg-bg-secondary border-text_secondary text-pink_primary dark:text-blue-dark-helper mx-2 cursor-pointer rounded-md border border-solid p-1'
										>
											<CopyIcon className='text-lightBlue dark:text-icon-dark-inactive relative text-2xl' /> /start
										</button>
									</li>
								</ol>
							</div>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

export default TelegramInfoModal;
