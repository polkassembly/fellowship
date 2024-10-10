// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
	index: number;
	title: string;
	url: string;
	thumbnail: string;
	className?: string;
}

function RecordingListingBody({ className = '', index = 0, title = '', url = '', thumbnail = '' }: Props) {
	return (
		<section className={`flex gap-2 ${className}`}>
			<p className='mt-0.5 hidden text-xs font-normal text-secondaryText md:block'>#{index}</p>
			<article className='flex w-full flex-col gap-1'>
				<h2 className='text-sm font-medium'>{title}</h2>
				<Link
					href={url}
					className='cursor-pointer text-sm text-link underline'
				>
					{url}
				</Link>
				{thumbnail && (
					<Image
						className='mt-2 h-40 w-full rounded-lg object-cover
                        md:h-32 xl:h-40 2xl:h-44'
						src={thumbnail}
						width={800}
						height={400}
						alt={title}
					/>
				)}
			</article>
		</section>
	);
}

export default RecordingListingBody;
