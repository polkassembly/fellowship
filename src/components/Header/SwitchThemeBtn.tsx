// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Button } from '@nextui-org/button';
import { useTheme } from 'next-themes';
import React from 'react';

function SwitchThemeBtn({ closeMenu }: { closeMenu: () => void }) {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			size='sm'
			variant='bordered'
			radius='full'
			onClick={() => {
				setTheme(theme === 'dark' ? 'light' : 'dark');
				closeMenu();
			}}
		>
			<span suppressHydrationWarning>{theme === 'dark' ? 'Light' : 'Dark'}</span>
		</Button>
	);
}

export default SwitchThemeBtn;
