// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { poppinsFont } from '@/utils/fonts';
import React from 'react';

interface Props {
	header: string;
	message?: string;
}

function NotificationMessage({ header, message }: Props) {
	return (
		<div className={`${poppinsFont.className} flex flex-col`}>
			<h3 className='text-sm font-medium'>{header}</h3>
			{message && <p className='text-xs'>{message}</p>}
		</div>
	);
}

export default NotificationMessage;
