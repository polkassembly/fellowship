// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { ReactNode } from 'react';
import Image from 'next/image';

interface Props {
	className?: string;
	imgSize?: number;
	text?: ReactNode;
}

function ComingSoon({ className, imgSize = 128, text = 'Construction zone ahead! New feature coming to life soon.' }: Props) {
	return (
		<div className={`${className} flex flex-col items-center justify-center gap-6`}>
			<Image
				alt='Coming soon Image'
				height={imgSize}
				width={imgSize}
				src='/misc/undraw-under-construction.svg'
			/>
			<div className='text-center'>{text}</div>
		</div>
	);
}

export default ComingSoon;
