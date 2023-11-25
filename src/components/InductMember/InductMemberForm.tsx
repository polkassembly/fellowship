// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';
import React, { useState } from 'react';

function InductMemberForm() {
	const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(['1']));

	return (
		<div className='p-6'>
			<Accordion
				selectedKeys={selectedKeys}
				onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
				className='gap-8'
				variant='splitted'
				itemClasses={{
					base: 'group-[.is-splitted]:px-0 group-[.is-splitted]:rounded-t-2xl',
					heading:
						'transition-all group-[.is-splitted]:px-6 data-[open=true]:bg-inductionAccordionHeaderBg data-[open=true]:rounded-tl-2xl data-[open=true]:rounded-tr-2xl data-[open=true]:rounded-bl-none data-[open=true]:rounded-br-none',
					title: 'text-slate-600/70 data-[open=true]:text-white text-base',
					content: 'p-6'
				}}
			>
				<AccordionItem
					key='1'
					aria-label='View Application Request'
					title='View Application Request'
				>
					Accordion 1
				</AccordionItem>
				<AccordionItem
					key='2'
					aria-label='Create Preimage'
					title='Create Preimage'
				>
					Accordion 2
				</AccordionItem>
				<AccordionItem
					key='3'
					aria-label='Submit Proposal'
					title='Submit Proposal'
				>
					Accordion 3
				</AccordionItem>
			</Accordion>
		</div>
	);
}

export default InductMemberForm;
