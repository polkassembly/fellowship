// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Button } from '@nextui-org/button';
import { useTheme } from 'next-themes';
import React from 'react';
import Image from 'next/image';

function SwitchThemeBtn({ closeMenu }: { closeMenu: () => void }) {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			size='sm'
			variant='light'
			isIconOnly
			radius='full'
			onClick={() => {
				setTheme(theme === 'dark' ? 'light' : 'dark');
				closeMenu();
			}}
		>
			<span suppressHydrationWarning>
				{theme === 'dark' ? (
					<Image
						src='/icons/light-mode.svg'
						width={30}
						height={30}
						alt='Light mode icon'
					/>
				) : (
					<Image
						src='/icons/dark-mode.svg'
						width={30}
						height={30}
						alt='Dark mode icon'
					/>
				)}
			</span>
		</Button>
	);
}

export default SwitchThemeBtn;
