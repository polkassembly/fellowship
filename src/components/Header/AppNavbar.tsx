// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styles from './Header.module.scss';
import NetworkDropdown from './NetworkDropdown';
import SearchBar from './SearchBar';
import ConnectWalletButton from './ConnectWalletButton';

function AppNavbar() {
	return (
		<nav
			id='appNavbar'
			className={styles.appNavbar}
		>
			<SearchBar className='w-[70%]' />
			<NetworkDropdown />
			<ConnectWalletButton />
		</nav>
	);
}

export default AppNavbar;
