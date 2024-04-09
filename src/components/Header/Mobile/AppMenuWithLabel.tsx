// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';
import styles from '../Header.module.scss';

function AppMenuWithLabel({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className='flex w-full flex-col md:w-auto'>
			<span className={styles.appMenuLabel}>{label}</span>
			{children}
		</div>
	);
}

export default AppMenuWithLabel;
