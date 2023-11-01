// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card } from '@nextui-org/card';
import React from 'react';
import Image from 'next/image';

interface Props {
	className?: string;
	type?: 'error' | 'warning' | 'info' | 'success' | 'default';
	message: string;
}

// TODO: add icons and classes for other types

const classNameMap = {
	error: 'bg-red-300/50 border-red-300 text-red',
	warning: 'bg-yellow-300/50 border-yellow-300 text-yellow',
	info: 'bg-blue-300/50 border-blue-300 text-foreground',
	success: 'bg-green-300/50 border-green-300 text-green',
	default: 'bg-primary/10 border-primary_border text-primary'
};

const iconMap = {
	error: '',
	warning: '',
	info: '/icons/info.svg',
	success: '',
	default: ''
};

function AlertCard({ className, type = 'default', message }: Props) {
	const iconPath = iconMap[String(type) as keyof typeof iconMap];

	return (
		<Card
			className={`${className} ${classNameMap[String(type) as keyof typeof classNameMap]} flex flex-row items-center justify-start gap-2 border-1 p-3`}
			shadow='none'
			radius='sm'
		>
			{iconPath && (
				<Image
					alt='Info Icon'
					src={iconPath}
					width={18}
					height={18}
				/>
			)}
			<span className='text-xs font-medium capitalize'>{message}</span>
		</Card>
	);
}

export default AlertCard;
