// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Spinner } from '@nextui-org/spinner';

function LoadingSpinner({ className = '', message = 'Loading...' }: { className?: string; message?: string }) {
	return (
		<div className={`${className} flex flex-col items-center justify-center gap-3`}>
			<Spinner />
			<span className='text-xs'>{message}</span>
		</div>
	);
}

export default LoadingSpinner;
