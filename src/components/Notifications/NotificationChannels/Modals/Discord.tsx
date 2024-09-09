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

function DiscordInfoModal({ title, open, getVerifyToken, generatedToken = '', onClose }: Readonly<Props>) {
	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState(generatedToken);
	const { username } = useUserDetailsContext();

	const handleGenerateToken = async () => {
		setLoading(true);
		try {
			const data = await getVerifyToken(CHANNEL.DISCORD);
			if (!data) {
				queueNotification({ message: 'Error generating token', header: 'Error', status: 'error' });
				return;
			}
			setToken(data);
		} catch (error) {
			queueNotification({ message: 'Unexpected error occurred', header: 'Error', status: 'error' });
		} finally {
			setLoading(false);
		}
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
						<ModalHeader className='flex gap-2 border-b border-primary_border text-xl font-semibold'>
							<Image
								alt='Login Icon'
								src='/icons/settings/discord.svg'
								width={24}
								height={24}
								className='ml-[-8px] mr-2 dark:grayscale dark:invert'
							/>
							{title}
						</ModalHeader>

						<ModalBody>
							<ol>
								<li className='list-inside leading-[40px] dark:text-white'>
									Click this invite link{' '}
									<span className='bg-bg-secondary border-text_secondary text-pink_primary dark:text-blue-dark-helper mx-2 rounded-md border border-solid p-1'>
										<a
											href='https://discord.com/oauth2/authorize?client_id=1112538708219007017&permissions=397284485120&scope=bot'
											target='_blank'
											rel='noreferrer'
										>
											discord.com/api/oauth2/
										</a>
									</span>
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
										<>
											<div className='list-inside leading-[40px] dark:text-white'>
												Copy your username:{' '}
												<button
													type='button'
													onClick={() => handleCopyClicked(username as string)}
													className='bg-bg-secondary border-text_secondary text-pink_primary dark:text-blue-dark-helper mx-2 cursor-pointer rounded-md border border-solid p-1'
												>
													<CopyIcon className='dark:grayscale dark:invert' /> {username}
												</button>
											</div>

											<div className='dark:text-white'>
												<span>Verification Token: </span>
												<button
													type='button'
													onClick={() => handleCopyClicked(token)}
													className='token-desktop-container bg-bg-secondary border-text_secondary text-pink_primary dark:text-blue-dark-helper mx-2 cursor-pointer rounded-md border border-solid p-1'
												>
													<CopyIcon className='dark:grayscale dark:invert' /> {token}
												</button>
											</div>
										</>
									)}
								</li>
							</ol>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

export default DiscordInfoModal;
