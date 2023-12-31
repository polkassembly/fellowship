// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import '../global/globals.scss';
import 'react-toastify/dist/ReactToastify.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import AppSidebar from '@/components/Header/AppSidebar';
import AppNavbar from '@/components/Header/AppNavbar';
import NotificationsContainer from '@/components/Misc/NotificationsContainer';
import { poppinsFont } from '@/utils/fonts';
import ComingSoon from '@/components/Misc/ComingSoon';
import { Providers } from '../global/providers';

export const metadata: Metadata = {
	title: 'Polkassembly | Fellowship',
	description: 'Fellowship never felt so good before.'
};

export default function RootLayout({ children, modal }: { children: ReactNode; modal: ReactNode }) {
	return (
		<html lang='en'>
			<body className={`${poppinsFont.className}`}>
				<ComingSoon
					className='flex h-[100vh] w-[100vw] items-center justify-center p-5 md:hidden'
					text={
						<span>
							Construction zone ahead!
							<br /> Mobile view coming soon...
						</span>
					}
				/>
				<Providers>
					<section id='root-section'>
						<section className='fixed h-[96vh]'>
							<AppSidebar />
						</section>
						<section id='main-section'>
							<AppNavbar />
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
