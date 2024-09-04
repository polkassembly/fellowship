// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';
import React, { useMemo } from 'react';
import Image from 'next/image';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import MESSAGES from '@/global/messages';
import { MessageType, PostView, ProposalType } from '@/global/types';
import getErrorString from '@/utils/getErrorString';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import queueNotification from '@/utils/queueNotification';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import classNames from 'classnames';

interface Props {
	postId: number | string;
	postType?: ProposalType;
	onView: (user_id: number) => void;
	views: PostView[];
}

function AddViewBtn({ postId, postType, onView, views }: Props) {
	const currentUser = useUserDetailsContext();
	const { network } = useApiContext();

	const userView = useMemo(() => {
		return views.find((view) => view.user_id === currentUser.id) || null;
	}, [currentUser.id, views]);

	const addView = async () => {
		if (!(currentUser.id || currentUser.id === 0)) {
			queueNotification({
				header: 'Warning!',
				message: 'Please login to add reaction',
				status: 'warn',
				duration: 2000
			});
			return;
		}
		onView(currentUser?.id);
		if (userView) {
			return;
		}
		try {
			const { data, error } = await nextApiClientFetch<MessageType>({
				network,
				url: 'api/v1/auth/actions/addPostView',
				isPolkassemblyAPI: true,
				data: {
					userId: currentUser?.id,
					postId,
					postType: postType || null
				}
			});
			if (data) {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
			} else {
				queueNotification({
					header: 'Error!',
					message: getErrorString(error) || MESSAGES[API_ERROR_CODE.REACTION_ACTION_ERROR],
					status: 'error',
					duration: 2000
				});
			}
		} catch (error) {
			queueNotification({
				header: 'Error!',
				message: getErrorString(error) || MESSAGES[API_ERROR_CODE.REACTION_ACTION_ERROR],
				status: 'error',
				duration: 2000
			});
		}
	};

	return (
		<Tooltip
			className='bg-tooltip_background capitalize text-tooltip_foreground'
			content='Views'
		>
			<Button
				variant='light'
				isIconOnly
				aria-label='Add View'
				radius='full'
				onClick={(e) => {
					e.preventDefault();
					addView();
				}}
				className={classNames('text-lg', {
					'bg-transparent': !userView,
					'bg-gray-200 dark:bg-white': !!userView
				})}
			>
				<Image
					src='/icons/post/add-view.svg'
					alt='Add View'
					width={24}
					height={24}
					className='dark:dark-icon-filter'
				/>
			</Button>
		</Tooltip>
	);
}

export default AddViewBtn;
