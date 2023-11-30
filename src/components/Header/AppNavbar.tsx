// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import styles from './Header.module.scss';
import SearchBar from './SearchBar';
import SwitchThemeBtn from './SwitchThemeBtn';

const ConnectWalletButton = dynamic(() => import('./ConnectWalletButton'), { ssr: false });
const NetworkDropdown = dynamic(() => import('./NetworkDropdown'), { ssr: false });

function AppNavbar() {
	return (
		<nav
			id='appNavbar'
			className={styles.appNavbar}
		>
			<SearchBar className='w-[70%]' />
			<NetworkDropdown />
			<ConnectWalletButton />
			<SwitchThemeBtn />
		</nav>
	);
}

export default AppNavbar;
