// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import MarkdownEditor from '@/components/TextEditor/MarkdownEditor';
import { usePostDataContext } from '@/contexts';
import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/card';
import { Input } from '@nextui-org/input';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

function EditPostCard() {
	const {
		postData: { content, title }
	} = usePostDataContext();

	const {
		register,
		formState: { errors },
		control
	} = useForm({
		defaultValues: {
			title,
			content
		}
	});

	return (
		<Card
			shadow='none'
			className='flex flex-col gap-3 border border-primary_border p-6'
		>
			<form className='flex flex-col gap-3'>
				<div>
					<Input
						label={
							<span>
								Title<span className='text-base text-rose-500'>*</span>
							</span>
						}
						placeholder='Enter your proposal title'
						labelPlacement='outside'
						variant='bordered'
						radius='sm'
						classNames={{
							label: 'text-sm font-normal -mb-1',
							inputWrapper: 'border-primary_border border-1'
						}}
						{...register('title')}
						aria-invalid={errors.title ? 'true' : 'false'}
						// disabled={loading}
					/>
					{errors.title?.message && (
						<small
							className='text-warning'
							role='alert'
						>
							{errors.title.message.toString()}
						</small>
					)}
				</div>

				<div>
					<div className='mb-1 text-sm font-normal'>
						Description<span className='text-base text-rose-500'>*</span>
					</div>

					<Controller
						name='content'
						control={control}
						render={({ field }) => (
							<MarkdownEditor
								{...field}
								// disabled={loading}
							/>
						)}
					/>
					{errors.content?.message && (
						<small
							className='text-warning'
							role='alert'
						>
							{errors.content.message.toString()}
						</small>
					)}
				</div>

				<Button
					color='primary'
					variant='flat'
				>
					Save
				</Button>
			</form>
		</Card>
	);
}

export default EditPostCard;
