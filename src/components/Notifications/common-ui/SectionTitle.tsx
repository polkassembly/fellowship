// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

interface ISectionTitleProps {
	icon?: React.ReactNode;
	title: string;
	desc?: string;
}

export default function SectionTitle({ icon, title, desc }: ISectionTitleProps) {
	return (
		<div className='flex items-center px-6'>
			{icon}
			<div className='flex items-center gap-2'>
				<h3 className='text-base font-semibold leading-6'>{title}</h3>
				{desc && <span className='text-sm'>{desc}</span>}
			</div>
		</div>
	);
}
