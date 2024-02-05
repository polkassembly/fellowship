// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import styled from 'styled-components';

interface EditSocialModalProps {
	modalOpen: boolean;
	setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledModal = styled(Modal)`
	.ant-modal-content {
		background-color: #000;
		color: #fff;
		border: 1px solid #fff;
	}
	.ant-modal-header {
		background-color: #000;
		color: #fff;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid slategray;
	}
	.ant-modal-title {
		color: #fff;
	}
	.ant-modal-close {
		color: #fff;
	}
	.ant-modal-body {
		padding-block: 1rem;
	}
`;
function EditSocialModal({ modalOpen, setModalOpen }: EditSocialModalProps) {
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
		<StyledModal
			open={modalOpen}
			onCancel={() => setModalOpen(false)}
			onOk={handleSave}
			title='Edit Social Media Links'
			footer={[
				<Button
					key='back'
					className='font-semibold dark:text-white'
					onClick={() => setModalOpen(false)}
				>
					Cancel
				</Button>,
				<Button
					key='submit'
					className='bg-secondary font-semibold'
					type='primary'
					onClick={handleSave}
				>
					Save
				</Button>
			]}
		>
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
			</div>
		</StyledModal>
	);
}

export default EditSocialModal;
