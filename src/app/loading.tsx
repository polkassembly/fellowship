// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Spinner } from '@nextui-org/spinner';
import React from 'react';

function Loading() {
	return (
		<section className='flex min-h-[25vh] flex-col items-center justify-center'>
			<Spinner />
		</section>
	);
}

export default Loading;
