// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card } from '@nextui-org/card';
import React from 'react';
import { ActivityType, IRecording } from '@/global/types';
import classNames from 'classnames';
import ContentListingHeader from '../Post/ContentListingHeader';
import RecordingListingBody from './RecordingListingBody';
import LinkWithNetwork from '../Misc/LinkWithNetwork';

interface Props {
	recording: IRecording;
	cardClassName?: string;
}

function RecordingListingCard({ recording, cardClassName }: Props) {
	return (
		<article className='w-full lg:max-w-[calc(100vw-300px)] xl:max-w-[calc(100vw-600px)]'>
			<Card
				shadow='none'
				// eslint-disable-next-line prettier/prettier
				className={classNames('border border-primary_border bg-cardBg', cardClassName)}
				isHoverable
				isPressable
				as={LinkWithNetwork}
				href={`/recordings/${recording.id}`}
			>
				{/* Need this wrapper div because isPressable breaks styles */}
				<div className='flex flex-col gap-3 px-6 py-4 text-left'>
					<ContentListingHeader
						activityType={ActivityType.RECORDING}
						address={recording.who}
						createdAt={recording.created_at}
					/>
					<RecordingListingBody
						index={Number(recording.id)}
						title={recording.title}
						url={recording.url}
						thumbnail={recording.thumbnail}
					/>
				</div>
			</Card>
		</article>
	);
}

export default RecordingListingCard;
