// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/card';
import { useTheme } from 'next-themes';

export default function Home() {
	const { theme, setTheme } = useTheme();

	return (
		<Card>
			<Button
				color='primary'
				onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
			>
				Click me
			</Button>
		</Card>
	);
}
