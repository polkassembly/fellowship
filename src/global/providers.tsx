// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { ApiContextProvider } from '@/contexts/ApiContext';
import { UserDetailsProvider } from '@/contexts/UserDetailsContext';
import { NextUIProvider } from '@nextui-org/system';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
	return (
		<NextUIProvider>
			<ThemeProvider
				attribute='class'
				defaultTheme='light'
				themes={['light', 'dark']}
			>
				<ApiContextProvider>
					<UserDetailsProvider>{children}</UserDetailsProvider>
				</ApiContextProvider>
			</ThemeProvider>
		</NextUIProvider>
	);
}
