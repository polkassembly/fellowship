// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { useApiContext } from '@/contexts';
import Link from 'next/link';
import React from 'react';

interface Props {
	className?: string;
	children?: React.ReactNode;
	href?: string;
	replace?: boolean;
	target?: string;
	rel?: string;
}

function LinkWithNetwork({ className, href, children, replace = false, target = '_self', rel }: Props) {
	const { network } = useApiContext();

	return (
		<Link
			replace={replace}
			href={`${href}?network=${network}`}
			className={className}
			target={target}
			rel={rel}
		>
			{children}
		</Link>
	);
}

export default LinkWithNetwork;
