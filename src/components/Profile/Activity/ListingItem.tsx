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
import LinkWithNetwork from '@/components/Misc/LinkWithNetwork';
import Link from 'next/link';
import { useApiContext } from '@/contexts';
import { getActivityIconSrc, getCreatedAtDate, getProposalTitle } from './utils';
import AddressInline from '../Address/AddressInline';
import Address from '../Address';

interface Props {
	feedItem: UserActivityListingItem;
}

function ActivityIcon({ feedItem }: Props) {
	const src = getActivityIconSrc(feedItem);
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

function ActivityText({ feedItem }: Props) {
	const { activityType } = feedItem;
	const { network } = useApiContext();
	switch (activityType) {
		case SubsquidActivityType.RetentionRequest:
		case SubsquidActivityType.PromotionRequest:
		case SubsquidActivityType.DemotionRequest:
		case SubsquidActivityType.InductionRequest:
		case SubsquidActivityType.GeneralProposal:
		case SubsquidActivityType.RFC:
			return (
				<div className='flex items-center gap-x-2 text-sm'>
					<span>Created {getProposalTitle(feedItem)}</span>
					<p className='text-sm font-semibold leading-4 tracking-[0.21px]'>{feedItem?.proposal?.title === DEFAULT_POST_TITLE ? '' : feedItem?.proposal?.title}</p>
				</div>
			);
		case SubsquidActivityType.EvidenceSubmitted:
			return (
				<div className='flex items-center gap-x-2 text-sm'>
					<Address
						variant='inline'
						address={feedItem.who || ''}
						truncateCharLen={4}
					/>
					<p>
						submitted an evidence onchain for <span className=' text-sm font-semibold leading-4 tracking-[0.21px]'>{feedItem?.otherActions?.wish || ''}</span>
					</p>
				</div>
			);
		case SubsquidActivityType.SalaryInduction:
			return (
				<div className='flex items-center gap-x-2 text-sm'>
					<Address
						variant='inline'
						address={feedItem.who || ''}
						truncateCharLen={4}
					/>
					<p>
						inducted themselves into payout system for salary of cycle{' '}
						<span className=' text-sm font-semibold leading-4 tracking-[0.21px]'>{feedItem?.salaryCycle?.cycleIndex || ''}</span>
					</p>
				</div>
			);
		case SubsquidActivityType.Voted:
			return (
				<Link
					href={`/referenda/${feedItem?.proposal?.index || feedItem?.vote?.proposalIndex || ''}?network=${network}`}
					target='_blank'
				>
					<div className='flex items-center gap-x-1 text-sm'>
						<span
							className={classNames('', {
								'text-voteAye': feedItem?.vote?.decision === 'yes',
								'text-voteNay': !(feedItem?.vote?.decision === 'yes')
							})}
						>
							Voted {feedItem?.vote?.decision === 'yes' ? 'Aye' : 'Nay'}
						</span>
						<span>on {getProposalTitle(feedItem)}</span>
						<p className='text-sm font-semibold leading-4 tracking-[0.21px]'>{feedItem?.proposal?.title === DEFAULT_POST_TITLE ? '' : feedItem?.proposal?.title}</p>
					</div>
				</Link>
			);
		case SubsquidActivityType.Imported:
			return (
				<div className='flex items-center gap-x-2 text-sm'>
					<Address
						variant='inline'
						address={feedItem.who || ''}
						truncateCharLen={4}
					/>
					<p>
						was imported into the technical fellowship at <span className=' text-sm font-semibold leading-4 tracking-[0.21px]'>Rank {feedItem?.otherActions?.rank || ''}</span>
					</p>
				</div>
			);
		case SubsquidActivityType.Promoted:
			return (
				<div className='flex items-center gap-x-2 text-sm'>
					<Address
						variant='inline'
						address={feedItem.who || ''}
						truncateCharLen={4}
					/>
					<p>
						was promoted from rank <span className=' text-sm font-semibold leading-4 tracking-[0.21px]'>{feedItem?.otherActions?.rank || ''}</span>
						to rank <span className=' text-sm font-semibold leading-4 tracking-[0.21px]'>{feedItem?.otherActions?.toRank || ''}</span>
					</p>
				</div>
			);
		case SubsquidActivityType.Retained:
			return (
				<div className='flex items-center gap-x-2 text-sm'>
					<Address
						variant='inline'
						address={feedItem.who || ''}
						truncateCharLen={4}
					/>
					<p>
						was retained at rank <span className=' text-sm font-semibold leading-4 tracking-[0.21px]'>{feedItem?.otherActions?.rank || ''}</span>
					</p>
				</div>
			);
		case SubsquidActivityType.Registration:
			return (
				<div className='flex items-center gap-x-2 text-sm'>
					<Address
						variant='inline'
						address={feedItem.who || ''}
						truncateCharLen={4}
					/>
					<p>
						registered themselves into payout system for salary of cycle{' '}
						<span className=' text-sm font-semibold leading-4 tracking-[0.21px]'>{feedItem?.salaryCycle?.cycleIndex || ''}</span>
					</p>
				</div>
			);
		case SubsquidActivityType.ActivityChanged:
			console.log(feedItem.who);
			return (
				<div className='flex items-center gap-x-2 text-sm'>
					<Address
						variant='inline'
						address={feedItem.who || ''}
						truncateCharLen={4}
					/>
					<p>
						set themselves <span className=' text-sm font-semibold leading-4 tracking-[0.21px]'>{feedItem?.otherActions?.isActive ? 'Active' : 'Inactive'}</span>
					</p>
				</div>
			);
		case SubsquidActivityType.Payout:
			return (
				<div className='flex items-center gap-x-2 text-sm'>
					<AddressInline
						address={feedItem.who || ''}
						endChars={5}
						startChars={5}
					/>
					<p>
						recieved payout of <span className=' text-sm font-semibold leading-4 tracking-[0.21px]'>{feedItem?.payout?.amount}$</span> at rank{' '}
						<span className=' text-sm font-semibold leading-4 tracking-[0.21px]'>{feedItem?.payout?.rank}$</span> for salary of cycle{' '}
						<span className=' text-sm font-semibold leading-4 tracking-[0.21px]'>{feedItem?.salaryCycle?.cycleIndex}$</span>
					</p>
				</div>
			);
		case SubsquidActivityType.OffBoarded:
			return (
				<div className='flex items-center gap-x-2 text-sm'>
					<AddressInline
						address={feedItem.who || ''}
						endChars={5}
						startChars={5}
					/>
					<p>was off boarded from the technical fellowship.</p>
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

interface LinkWrapperProps {
	children: React.ReactNode;
	index?: number;
}

function LinkWrapper({ children, index }: LinkWrapperProps) {
	const { network } = useApiContext();
	if (index || index === 0) {
		return (
			<Link
				href={`/referenda/${index}?network=${network}`}
				className='flex'
				target='_blank'
			>
				{children}
			</Link>
		);
	}
	return <article className='flex'>{children}</article>;
}

function ListingItem({ feedItem, isLastItem }: ListingItemProps) {
	return (
		<LinkWrapper index={feedItem?.proposal?.index}>
			<div className='relative'>
				<ActivityIcon feedItem={feedItem} />
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
		</LinkWrapper>
	);
}

export default ListingItem;
