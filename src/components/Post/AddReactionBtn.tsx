// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from '@nextui-org/button';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/popover';
import { MessageType, ProposalType, PublicReactionEntry, Reaction } from '@/global/types';
import { Tooltip } from '@nextui-org/tooltip';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import { useUserDetailsContext, useApiContext } from '@/contexts';
import queueNotification from '@/utils/queueNotification';
import getErrorString from '@/utils/getErrorString';
import classNames from 'classnames';
import MESSAGES from '@/global/messages';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { v4 as uuidv4 } from 'uuid';

interface ReactionsListProps {
	userReaction: PublicReactionEntry | null;
	onReaction: (reaction: string) => Promise<void>;
}

function ReactionsList({ userReaction, onReaction }: ReactionsListProps) {
	return Object.values(Reaction).map((reaction, i) => (
		<Tooltip
			className='bg-tooltip_background capitalize text-tooltip_foreground'
			content={<span key={reaction}>{Object.keys(Reaction)[i as number].toLowerCase()}</span>}
			key={reaction}
		>
			<Button
				variant='light'
				isIconOnly
				aria-label='Like'
				radius='full'
				className={classNames('text-lg', {
					'bg-transparent': reaction !== userReaction?.reaction,
					'bg-primary_accent': reaction === userReaction?.reaction
				})}
				onClick={() => {
					onReaction(reaction);
				}}
			>
				{reaction}
			</Button>
		</Tooltip>
	));
}

interface Props {
	postId: number | string;
	postType?: ProposalType;
	reactions: PublicReactionEntry[];
	addReaction: (reaction: PublicReactionEntry) => void;
	removeReaction: (reaction: PublicReactionEntry) => void;
}

function AddReactionBtn({ postId, postType, reactions, addReaction, removeReaction }: Props) {
	const currentUser = useUserDetailsContext();
	const { network } = useApiContext();
	const [isOpen, setIsOpen] = useState(false);

	const userReaction = useMemo(() => {
		return reactions.find((reaction) => reaction.user_id === currentUser.id) || null;
	}, [currentUser.id, reactions]);

	// eslint-disable-next-line sonarjs/cognitive-complexity
	const onReaction = async (reaction: string) => {
		setIsOpen(false);
		if (!(currentUser.id || currentUser.id === 0)) {
			queueNotification({
				header: 'Warning!',
				message: 'Please login to add reaction',
				status: 'warn',
				duration: 2000
			});
			return;
		}
		if (userReaction?.reaction === reaction) {
			queueNotification({
				header: 'Success!',
				message: 'Reaction removed successfully',
				status: 'success',
				duration: 2000
			});
			removeReaction(userReaction);
			try {
				const { data, error } = await nextApiClientFetch<MessageType>({
					network,
					url: 'api/v1/auth/actions/removePostReaction',
					isPolkassemblyAPI: true,
					data: {
						userId: currentUser?.id,
						postId,
						reaction,
						postType: postType || null // needed for activity reactions
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
		} else {
			queueNotification({
				header: 'Success!',
				message: 'Reaction added successfully',
				status: 'success',
				duration: 2000
			});
			addReaction({
				id: userReaction?.id || uuidv4(),
				user_id: currentUser.id,
				created_at: new Date(),
				updated_at: new Date(),
				username: currentUser.username || '',
				reaction: reaction as Reaction
			});
			try {
				const { data, error } = await nextApiClientFetch<MessageType>({
					network,
					url: 'api/v1/auth/actions/addPostReaction',
					isPolkassemblyAPI: true,
					data: {
						userId: currentUser?.id,
						postId,
						reaction,
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
		}
	};

	return (
		<Popover
			isOpen={isOpen}
			placement='top'
		>
			<PopoverTrigger>
				<Button
					variant='light'
					isIconOnly
					aria-label='Add Reaction'
					radius='full'
					onClick={(e) => {
						e.preventDefault();
						setIsOpen(true);
					}}
					className={classNames('text-lg', {
						'bg-transparent': !userReaction,
						'bg-gray-200 dark:bg-white': !!userReaction
					})}
				>
					<Image
						src='/icons/post/add-reaction.svg'
						alt='Add Reaction'
						width={24}
						height={24}
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<div className='flex gap-1'>
					<ReactionsList
						onReaction={onReaction}
						userReaction={userReaction}
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}

export default AddReactionBtn;
