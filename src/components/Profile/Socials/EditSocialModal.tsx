// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useState } from 'react';
import { ISocial } from '@/global/types';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { socials } from '@/global/constants/socials';

interface EditSocialModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
	socialLinks: ISocial[];
	setSocialLinks: React.Dispatch<React.SetStateAction<ISocial[]>>;
	loading: boolean;
	handleSave: (onSuccess?: () => void) => void;
}

function EditSocialModal({ isOpen, onOpenChange, socialLinks, setSocialLinks, loading, handleSave }: EditSocialModalProps) {
	const [inputError, setInputError] = useState(false);

	const getPlaceholder = (socialLink: string) => {
		switch (socialLink) {
			case 'Email':
				return 'Enter your email address';
			case 'Riot':
				return 'eg: https://riot.im/app/#/user/@handle:matrix.org';
			case 'Twitter':
				return 'eg: https://twitter.com/handle';
			case 'Telegram':
				return 'eg: https://t.me/handle';
			case 'Discord':
				return 'eg: https://discordapp.com/users/handle';
			case 'Github':
				return 'eg: https://github.com/handle';
			default:
				return `Enter ${socialLink} URL`;
		}
	};

	const isInValidInput = (value: string, socialLink: string) => {
		if (!value) return false;

		switch (socialLink) {
			case 'Email':
				return !value.includes('@');
			case 'Riot':
				return !value.includes('riot.im');
			case 'Twitter':
				return !value.includes('twitter.com');
			case 'Telegram':
				return !value.includes('t.me');
			case 'Discord':
				return !value.includes('discordapp.com');
			case 'Github':
				return !value.includes('github.com');
			default:
				return false;
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			scrollBehavior='inside'
			size='lg'
			className='bg-cardBg'
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className='flex flex-col gap-1 border-b'>Edit Socials</ModalHeader>
						<ModalBody>
							{socials.map((socialLink) => {
								const strLink = socialLink.toString();
								const isInvalid = isInValidInput(socialLinks?.find((link) => link.type === strLink)?.link || '', strLink);
								return (
									<div
										key={strLink}
										className='mb-4'
									>
										<span className='mb-2 block text-sm font-bold tracking-widest text-primary'>{strLink}</span>
										<Input
											id={strLink}
											size='lg'
											variant='bordered'
											radius='md'
											type='text'
											placeholder={getPlaceholder(strLink)}
											isInvalid={isInvalid}
											errorMessage={isInvalid ? `Invalid ${strLink} ${strLink === 'Email' ? 'Address' : 'URL'}` : ''}
											onChange={(e) => {
												const value = e.target.value.trim();
												if (isInValidInput(value, strLink)) {
													setInputError(true);
												} else {
													setInputError(false);
												}
												setSocialLinks((prevLinks) => {
													const existingLink = prevLinks.find((link) => link.type === strLink);
													if (existingLink) {
														return prevLinks.map((link) => {
															if (link.type === strLink) {
																return {
																	...link,
																	link: value
																};
															}
															return link;
														});
													}

													return [
														...prevLinks,
														{
															type: socialLink,
															link: value
														}
													];
												});
											}}
											value={socialLinks.find((link) => link.type === strLink)?.link || ''}
											disabled={loading}
										/>
									</div>
								);
							})}
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
								isDisabled={loading || inputError}
								isLoading={loading}
								onPress={() => {
									handleSave(() => onClose());
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
