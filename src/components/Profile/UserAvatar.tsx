// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Avatar } from '@nextui-org/avatar';
import React from 'react';
import Image from 'next/image';

interface Props {
	className?: string;
	size?: number;
	src?: string;
}

function UserAvatar({ className, size, src }: Props) {
	return src ? (
		<Avatar
			size='lg'
			className={`${className} w-[${size}px] h-[${size}px]`}
			showFallback
			src={src}
		/>
	) : (
		<Image
			className={className}
			alt='User avatar'
			src='/icons/user-avatar.svg'
			width={size}
			height={size}
		/>
	);
}

UserAvatar.defaultProps = {
	className: '',
	size: 54,
	src: '/icons/user-avatar.svg'
};

export default UserAvatar;
