// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import styles from './Header.module.scss';
import SearchBar from './SearchBar';
import SwitchThemeBtn from './SwitchThemeBtn';
import AppMenuWithLabel from './Mobile/AppMenuWithLabel';

const ConnectWalletButton = dynamic(() => import('./ConnectWalletButton'), { ssr: false });
const NetworkDropdown = dynamic(() => import('./NetworkDropdown'), { ssr: false });
const RPCDropdown = dynamic(() => import('./RPCDropdown'), { ssr: false });

function AppMenu({ isOpen, closeMenu }: { isOpen: boolean; closeMenu: () => void }) {
	return (
		<menu
			id='appMenu'
			className={`${styles.appMenu} ${
				isOpen ? 'no-doc-scroll absolute inset-0 top-20 z-[9999] flex flex-col bg-background p-5 md:left-auto md:w-1/2 lg:hidden' : 'hidden lg:flex'
			}`}
		>
			<SearchBar className='w-full lg:w-[70%]' />
			<AppMenuWithLabel label='Network'>
				<NetworkDropdown closeMenu={closeMenu} />
			</AppMenuWithLabel>
			<AppMenuWithLabel label='Node'>
				<RPCDropdown closeMenu={closeMenu} />
			</AppMenuWithLabel>

			<ConnectWalletButton />
			<SwitchThemeBtn closeMenu={closeMenu} />
		</menu>
	);
}

export default AppMenu;
