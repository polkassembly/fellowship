// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { SubsquidActivityType, UserActivityListingItem } from '@/global/types';
import React from 'react';
import Image from 'next/image';
import dayjs from '@/services/dayjs-init';
import { Divider } from '@nextui-org/divider';
import classNames from 'classnames';
import DEFAULT_POST_TITLE from '@/global/constants/defaultTitle';
import { iconTypes, getActivityType, getCreatedAtDate } from './utils';
import AddressInline from '../Address/AddressInline';

function ActivityIcon({ iconType }: { iconType: string }) {
	// eslint-disable-next-line security/detect-object-injection
	const src = iconTypes[iconType];
	if (!src) {
		return null;
	}
	return (
		<Image
			alt='activity icons'
			src={src}
			width={36}
			height={36}
			className='rounded-full'
		/>
	);
}

interface ActivityTextProps {
	feedItem: UserActivityListingItem;
}

function ActivityText({ feedItem }: ActivityTextProps) {
	switch (feedItem.activityType) {
		case SubsquidActivityType.RetentionRequest:
		case SubsquidActivityType.PromotionRequest:
		case SubsquidActivityType.DemotionRequest:
		case SubsquidActivityType.InductionRequest:
		case SubsquidActivityType.GeneralProposal:
		case SubsquidActivityType.RFC:
			return (
				<div className='flex items-center gap-x-2 text-sm'>
					<span>Created proposal - </span>
					<p className='text-sm font-semibold leading-4 tracking-[0.21px]'>
						{feedItem?.proposal?.title === DEFAULT_POST_TITLE ? 'a Fellowship Proposal.' : feedItem?.proposal?.title}
					</p>
				</div>
			);
		case SubsquidActivityType.EvidenceSubmitted:
			return (
				<div className='flex items-center gap-x-2 text-sm'>
					<AddressInline
						address={feedItem.who || ''}
						endChars={5}
						startChars={5}
					/>
					<p>
						Submitted an evidence onchain for <span className=' text-sm font-semibold leading-4 tracking-[0.21px]'>{feedItem?.otherActions?.wish || ''}</span>
					</p>
				</div>
			);
		case SubsquidActivityType.SalaryInduction:
			return (
				<div className='flex items-center gap-x-2 text-sm'>
					<AddressInline
						address={feedItem.who || ''}
						endChars={5}
						startChars={5}
					/>
					<p>was inducted into payout system</p>
				</div>
			);
		case SubsquidActivityType.Voted:
			return (
				<div className='flex items-center gap-x-1 text-sm'>
					<span
						className={classNames('', {
							'text-voteAye': feedItem?.vote?.decision === 'yes',
							'text-voteNay': !(feedItem?.vote?.decision === 'yes')
						})}
					>
						Voted {feedItem?.vote?.decision === 'yes' ? 'Aye' : 'Nay'}
					</span>
					<span>on</span>
					<p className='text-sm font-semibold leading-4 tracking-[0.21px]'>
						{feedItem?.proposal?.title === DEFAULT_POST_TITLE ? 'a Fellowship Proposal.' : feedItem?.proposal?.title}
					</p>
				</div>
			);
		case SubsquidActivityType.Imported:
			return (
				<div className='flex items-center gap-x-2 text-sm'>
					<AddressInline
						address={feedItem.who || ''}
						endChars={5}
						startChars={5}
					/>
					<p>
						was imported into fellowship at <span className=' text-sm font-semibold leading-4 tracking-[0.21px]'>Rank {feedItem?.otherActions?.rank || ''}</span>
					</p>
				</div>
			);
		case SubsquidActivityType.ActivityChanged:
			return (
				<div className='flex items-center gap-x-2 text-sm'>
					<AddressInline
						address={feedItem.who || ''}
						endChars={5}
						startChars={5}
					/>
					<p>
						marked itself <span className=' text-sm font-semibold leading-4 tracking-[0.21px]'>{feedItem?.otherActions?.isActive ? 'Active' : 'Inactive'}</span>
					</p>
				</div>
			);
		default:
			return <div>N/A</div>;
	}
}

interface ListingItemProps {
	feedItem: UserActivityListingItem;
	isLastItem: boolean;
}

function ListingItem({ feedItem, isLastItem }: ListingItemProps) {
	const activityType = getActivityType(feedItem);
	return (
		<article className='flex'>
			<div className='relative'>
				<ActivityIcon iconType={activityType} />
				{!isLastItem ? <div className='absolute left-4 top-9 h-[calc(100%-36px)] w-[1px] bg-primary_border' /> : null}
			</div>
			<div className='flex-1 pl-4'>
				<ActivityText feedItem={feedItem} />
				<article className='mt-1 flex items-center gap-x-1'>
					<Image
						alt='clock icon'
						src='/icons/clock.svg'
						width={16}
						height={16}
						className='rounded-full'
					/>
					<span className='text-xs font-normal leading-[18px] tracking-[0.03px]'>{dayjs(getCreatedAtDate(feedItem)).format('DD MMM YYYY')}</span>
				</article>
				{!isLastItem ? <Divider className='my-4' /> : null}
			</div>
		</article>
	);
}

export default ListingItem;
