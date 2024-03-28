// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import '../global/globals.scss';
import 'react-toastify/dist/ReactToastify.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import AppSidebar from '@/components/Header/AppSidebar';
import AppNavbar from '@/components/Header/AppNavbar';
import AppNavMobile from '@/components/Header/Mobile/AppNavMobile';
import NotificationsContainer from '@/components/Misc/NotificationsContainer';
import { poppinsFont } from '@/utils/fonts';
import { Providers } from '../global/providers';

export const metadata: Metadata = {
	title: 'Polkassembly | Fellowship',
	description: 'Fellowship never felt so good before.'
};

export default function RootLayout({ children, modal }: { children: ReactNode; modal: ReactNode }) {
	return (
		<html lang='en'>
			<body className={`${poppinsFont.className}`}>
				<Providers>
					<section id='root-section'>
						<section className='hidden h-[96vh] md:fixed md:block'>
							<AppSidebar />
						</section>
						<section id='main-section'>
							<AppNavbar />
							<AppNavMobile />
							<main>{children}</main>
						</section>
					</section>
					<NotificationsContainer />
					{modal}
				</Providers>
			</body>
		</html>
	);
}
