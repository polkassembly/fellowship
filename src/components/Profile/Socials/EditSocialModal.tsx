// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';

interface EditSocialModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
}

function EditSocialModal({ isOpen, onOpenChange }: EditSocialModalProps) {
	const [mail, setMail] = useState('');
	const [twitter, setTwitter] = useState('');
	const [github, setGithub] = useState('');
	const [discord, setDiscord] = useState('');
	const [telegram, setTelegram] = useState('');
	const [riot, setRiot] = useState('');

	const handleSave = () => {
		//  Todo: validate && save to profile
	};

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className='flex flex-col gap-1'>Edit Socials</ModalHeader>
						<ModalBody>
							<div className='mb-4'>
								<span className='mb-2 block text-sm font-bold tracking-widest text-gray-300'>Mail</span>
								<Input
									id='mail'
									className='focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-300 shadow focus:border-primary_border focus:outline-none dark:bg-black dark:text-white dark:placeholder:text-gray-300'
									type='text'
									placeholder='example@mail.com'
									value={mail}
									onChange={(e) => setMail(e.target.value)}
									required
								/>
							</div>
							<div className='mb-4'>
								<span className='mb-2 block text-sm font-bold tracking-widest text-gray-300'>Twitter</span>
								<Input
									id='twitter'
									className='focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-300 shadow focus:border-primary_border focus:outline-none dark:bg-black dark:text-white dark:placeholder:text-gray-300'
									type='text'
									placeholder='example@mail.com'
									value={twitter}
									onChange={(e) => setTwitter(e.target.value)}
									required
								/>
							</div>
							<div className='mb-4'>
								<span className='mb-2 block text-sm font-bold tracking-widest text-gray-300'>Github</span>
								<Input
									id='github'
									className='focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-300 shadow focus:border-primary_border focus:outline-none dark:bg-black dark:text-white dark:placeholder:text-gray-300'
									type='text'
									placeholder='github.com/username'
									value={github}
									onChange={(e) => setGithub(e.target.value)}
									required
								/>
							</div>
							<div className='mb-4'>
								<span className='mb-2 block text-sm font-bold tracking-widest text-gray-300'>Discord</span>
								<Input
									id='discord'
									className='focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-300 shadow focus:border-primary_border focus:outline-none dark:bg-black dark:text-white dark:placeholder:text-gray-300'
									type='text'
									placeholder='username#1234'
									value={discord}
									onChange={(e) => setDiscord(e.target.value)}
									required
								/>
							</div>
							<div className='mb-4'>
								<span className='mb-2 block text-sm font-bold tracking-widest text-gray-300'>Telegram</span>
								<Input
									id='telegram'
									className='focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-300 shadow focus:border-primary_border focus:outline-none dark:bg-black dark:text-white dark:placeholder:text-gray-300'
									type='text'
									placeholder='t.me/username'
									value={telegram}
									onChange={(e) => setTelegram(e.target.value)}
									required
								/>
							</div>
							<div className='mb-4'>
								<span className='mb-2 block text-sm font-bold tracking-widest text-gray-300'>Riot</span>
								<Input
									id='riot'
									className='focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-300 shadow focus:border-primary_border focus:outline-none dark:bg-black dark:text-white dark:placeholder:text-gray-300'
									type='text'
									placeholder='@username:matrix.org'
									value={riot}
									onChange={(e) => setRiot(e.target.value)}
									required
								/>
							</div>{' '}
						</ModalBody>

						<ModalFooter>
							<Button
								color='danger'
								variant='light'
								onPress={onClose}
							>
								Cancel
							</Button>
							<Button
								color='primary'
								onPress={() => {
									handleSave();
									onClose();
								}}
							>
								Save
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

export default EditSocialModal;
