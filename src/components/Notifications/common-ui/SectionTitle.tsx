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
		<div className='flex items-start px-6 md:items-center'>
			{icon}
			<div className='flex flex-col gap-2 md:flex-row md:items-center'>
				<h3 className='text-base font-semibold leading-6'>{title}</h3>
				{desc && <span className='text-sm'>{desc}</span>}
			</div>
		</div>
	);
}
