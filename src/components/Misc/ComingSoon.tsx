// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Image from 'next/image';

interface Props {
	className?: string;
	imgSize?: number;
}

function ComingSoon({ className, imgSize = 128 }: Props) {
	return (
		<div className={`${className} flex flex-col items-center justify-center gap-6`}>
			<Image
				alt='Coming soon Image'
				height={imgSize}
				width={imgSize}
				src='/misc/undraw-under-construction.svg'
			/>
			<div className='text-center'>Construction zone ahead! New feature coming to life soon.</div>
		</div>
	);
}

export default ComingSoon;
