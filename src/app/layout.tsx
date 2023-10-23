// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import '../global/globals.scss';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ReactNode } from 'react';
import AppSidebar from '@/components/Header/AppSidebar';
import AppNavbar from '@/components/Header/AppNavbar';
import { Providers } from '../global/providers';

const poppinsFont = Poppins({ subsets: ['latin'], weight: ['400', '500'] });

export const metadata: Metadata = {
	title: 'Polkassembly | Fellowship',
	description: 'Fellowship never felt so good.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en'>
			<Providers>
				<body className={`${poppinsFont.className}`}>
					<section>
						<AppSidebar />
					</section>
					<section id='main-section'>
						<AppNavbar />
						<main>{children}</main>
					</section>
				</body>
			</Providers>
		</html>
	);
}
