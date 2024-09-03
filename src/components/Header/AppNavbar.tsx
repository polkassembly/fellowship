// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Button } from '@nextui-org/button';
import THEME_CONSTANTS from '@/global/themeConstants';
import styles from './Header.module.scss';
import AppLogo from './AppLogo';

const AppMenu = dynamic(() => import('./AppMenu'), { ssr: false });

function AppNavbar() {
	const [menuOpen, setMenuOpen] = React.useState(false);
	const { resolvedTheme = 'light' } = useTheme();

	return (
		<nav
			id='appNavbar'
			className={styles.appNavbar}
		>
			<div className={styles.navMobileHeader}>
				<AppLogo />
				<Button
					isIconOnly
					variant='light'
					aria-label='Toggle Menu'
					onClick={() => setMenuOpen(!menuOpen)}
				>
					{menuOpen ? (
						<Image
							src={THEME_CONSTANTS[resolvedTheme as keyof typeof THEME_CONSTANTS].menuCloseIcon}
							alt='Menu'
							className='dark:dark-icon-filter fill-white stroke-white'
							width={20}
							height={20}
						/>
					) : (
						<Image
							src={THEME_CONSTANTS[resolvedTheme as keyof typeof THEME_CONSTANTS].menuIcon}
							alt='Menu'
							width={20}
							height={20}
							className='dark:dark-icon-filter fill-white stroke-white'
						/>
					)}
				</Button>
			</div>

			<AppMenu
				isOpen={menuOpen}
				closeMenu={() => setMenuOpen(false)}
			/>
		</nav>
	);
}

export default AppNavbar;
