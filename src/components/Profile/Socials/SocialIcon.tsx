// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface Props {
	src: string;
	alt: string;
}

function SocialIcon({ src, alt }: Props) {
	return (
		<div className='flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(210,216,224,0.20)]'>
			<img
				className=''
				src={src}
				alt={alt}
			/>
		</div>
	);
}

export default SocialIcon;
