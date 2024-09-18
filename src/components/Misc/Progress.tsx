// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useState, useEffect } from 'react';

type IProgressProps = {
	percentage: number;
	size?: number;
	strokeWidth?: number;
	color?: string;
};

function Progress({ percentage, size = 120, strokeWidth = 10, color = 'blue' }: IProgressProps) {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const [offset, setOffset] = useState(circumference);

	useEffect(() => {
		const progressOffset = ((100 - percentage) / 100) * circumference;
		setOffset(progressOffset);
	}, [percentage, circumference]);

	return (
		<div
			className='relative flex items-center justify-center'
			style={{ width: size, height: size }}
		>
			<svg
				width={size}
				height={size}
				fill='transparent'
			>
				<circle
					className='text-gray-300'
					strokeWidth={strokeWidth}
					stroke='currentColor'
					fill='transparent'
					r={radius}
					cx={size / 2}
					cy={size / 2}
				/>
				<circle
					className='transition-all duration-500'
					strokeWidth={strokeWidth}
					stroke={color}
					fill='transparent'
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap='round'
					r={radius}
					cx={size / 2}
					cy={size / 2}
				/>
			</svg>
			<span className='absolute text-xl font-semibold'>{percentage}%</span>
		</div>
	);
}

export default Progress;
