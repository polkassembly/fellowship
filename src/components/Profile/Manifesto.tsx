// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Button } from '@nextui-org/button';
import { Textarea } from '@nextui-org/input';
import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import { MessageType } from '@/global/types';
import queueNotification from '@/utils/queueNotification';
import getErrorString from '@/utils/getErrorString';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import Markdown from '../TextEditor/Markdown';

interface Props {
	manifesto: string;
	address: string;
}

function Manifesto({ manifesto: prevManifesto, address }: Props) {
	const [isEdit, setIsEdit] = useState(false);
	const [manifesto, setManifesto] = useState(prevManifesto);
	const { network } = useApiContext();
	const [loading, setLoading] = useState(false);
	const userDetails = useUserDetailsContext();

	const onSave = async () => {
		try {
			setLoading(true);
			const { data, error: loginError } = await nextApiClientFetch<MessageType>({
				network,
				url: 'api/v1/auth/actions/editProfile',
				isPolkassemblyAPI: true,
				data: {
					manifesto
				}
			});
			if (data) {
				queueNotification({
					header: 'Success!',
					message: 'Manifesto updated successfully.',
					status: 'success'
				});
				setIsEdit(false);
			} else {
				queueNotification({
					header: 'Error!',
					message: getErrorString(loginError),
					status: 'error'
				});
			}
		} catch (error) {
			queueNotification({
				header: 'Error!',
				message: getErrorString(error),
				status: 'error'
			});
		}
		setLoading(false);
	};

	const isLoggedInUserProfile = useMemo(() => {
		const substrateAddress = getSubstrateAddress(address);
		return userDetails?.addresses?.find((a) => getSubstrateAddress(a) === substrateAddress);
	}, [address, userDetails]);

	return (
		<article className='h-[223px] rounded-[20px] border border-primary_border bg-white px-4 py-6'>
			<div className='flex items-center gap-x-2'>
				<h4 className='text-base font-semibold leading-6'>Manifesto</h4>
				{isLoggedInUserProfile ? (
					<Image
						alt='edit icon'
						src='/icons/edit-pencil.svg'
						width={20}
						height={20}
						className='cursor-pointer'
						onClick={() => {
							setIsEdit(true);
						}}
					/>
				) : null}
			</div>
			{isEdit ? (
				<div className='flex flex-col gap-y-2'>
					<Textarea
						value={manifesto}
						onChange={(e) => {
							setManifesto(e.target.value);
						}}
						placeholder='Enter your manifesto'
						className=''
					/>
					<div className='flex justify-end gap-x-2'>
						<Button
							className='border border-primary bg-white text-primary'
							size='sm'
							onClick={() => {
								setIsEdit(false);
							}}
							isLoading={loading}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							className='bg-primary text-white'
							size='sm'
							onClick={onSave}
							isLoading={loading}
							disabled={loading}
						>
							Save
						</Button>
					</div>
				</div>
			) : manifesto ? (
				<div className='max-h-[146px] overflow-y-auto'>
					<Markdown
						className='text-sm font-normal leading-[21px] tracking-[0.14px] text-secondary'
						md={manifesto}
					/>
				</div>
			) : (
				<p className='flex max-h-[146px] items-center justify-center text-sm font-normal leading-[21px] tracking-[0.14px] text-secondary'>Please add your manifesto</p>
			)}
		</article>
	);
}

export default Manifesto;
