// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Image from 'next/image';
import React from 'react';

const images = ['/carousel/carousel-1.svg'];

function Carousel() {
	return (
		<div className='flex'>
			{images.map((image, index) => (
				<div key={image}>
					<Image
						src={image}
						alt={`Slide ${index}`}
						className='h-full w-[100vw]'
						width={500}
						height={300}
					/>
				</div>
			))}
		</div>
	);
}

export default Carousel;
