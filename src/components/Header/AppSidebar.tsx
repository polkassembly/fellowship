// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { Listbox, ListboxItem } from '@nextui-org/listbox';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Header.module.scss';
import JoinFellowshipButton from './JoinFellowshipButton';

function ListboxItemStartContent({ isParentItem = false, isCurrentRoute, icon }: { isParentItem: boolean; isCurrentRoute: boolean; icon?: string }) {
	return (
		<span className='flex'>
			{isCurrentRoute && !isParentItem && (
				<Image
					alt='border-image'
					src='/misc/border-right-pink.svg'
					width={6}
					height={20}
					className='ml-[-8px] mr-2'
				/>
			)}
			{icon && (
				<Image
					className={isCurrentRoute ? 'ml-7' : 'ml-8'}
					alt='icon'
					src={`/icons/sidebar/${icon}${isCurrentRoute ? '-filled' : '-outlined'}.svg`}
					width={20}
					height={20}
				/>
			)}
		</span>
	);
}

type NavItem = {
	label: string;
	icon?: string;
	url: string;
	subItem?: boolean;
	childUrls?: string[];
};

/*
Note: The order of the items in this array is the order they will appear in the sidebar
subItems are will have to be a separate object in the array with a subItem property
due to the way the Listbox component works.
*/
const navItems: NavItem[] = [
	{
		label: 'Activity',
		icon: 'home',
		url: '/'
	},
	{
		label: 'Voting',
		icon: 'vote',
		url: '#voting',
		childUrls: ['/general-proposals', '/rank-requests']
	},
	{
		label: 'General Proposals',
		url: '/general-proposals',
		subItem: true
	},
	{
		label: 'Rank Requests',
		url: '/rank-requests',
		subItem: true
	},
	{
		label: 'Members',
		icon: 'users',
		url: '/members'
	},
	{
		label: 'Inductions',
		icon: 'add-user',
		url: '/inductions'
	},
	{
		label: 'Profile',
		icon: 'shield-user',
		url: '/profile'
	},
	{
		label: 'Polkadot Github',
		icon: 'git-branch',
		url: '/polkadot-github'
	}
];

function AppSidebar() {
	const pathname = usePathname();
	const router = useRouter();

	return (
		<nav className={styles.appSidebar}>
			<div>
				<JoinFellowshipButton className='mb-7' />
				<Listbox
					className='-ml-9 w-[272px] text-sm'
					variant='flat'
					color='primary'
					aria-label='Sidebar navigation'
					selectedKeys={[pathname]}
					onAction={(key) => {
						if (key.toString().startsWith('#')) return;
						router.push(key.toString().toLowerCase());
					}}
				>
					{navItems.map((navItem) => {
						const isParentItem = Boolean(navItem.childUrls?.length);

						const pathnameLower = pathname.toLowerCase();
						let isCurrentRoute = pathnameLower === navItem.url;
						if (navItem.childUrls?.includes(pathnameLower)) {
							isCurrentRoute = true;
						}

						return (
							<ListboxItem
								id='nav-listbox-item'
								className={`mb-3 h-[40px] rounded-none hover:bg-transparent ${navItem.subItem && '-mt-3'} ${isParentItem && isCurrentRoute && 'text-primary'} ${
									isCurrentRoute && !isParentItem && styles.navListboxItemHover
								}`}
								key={navItem.url}
								textValue={navItem.label}
								startContent={
									<ListboxItemStartContent
										isParentItem={isParentItem}
										isCurrentRoute={isCurrentRoute}
										icon={navItem.icon}
									/>
								}
							>
								{navItem.url.startsWith('#') ? (
									<span>{navItem.label}</span>
								) : (
									<Link
										className={`${navItem.subItem && !isCurrentRoute && 'ml-16'} ${isCurrentRoute && navItem.subItem && 'ml-14'}`}
										href={navItem.url}
									>
										{navItem.label}
									</Link>
								)}
							</ListboxItem>
						);
					})}
				</Listbox>
			</div>

			<footer className='flex flex-col gap-y-4'>
				<Image
					alt='Polkassembly Logo'
					src='/brand/pa-logo-white-text.svg'
					width='155'
					height='55'
				/>
				<div className='ml-2 flex max-w-[150px] items-center justify-between gap-x-4'>
					<Link href='/'>
						<Image
							alt='Tiwtter Logo'
							src='/brand/twitter-grey.svg'
							width='20'
							height='20'
						/>
					</Link>

					<Link href='/'>
						<Image
							alt='Discord Logo'
							src='/brand/discord-grey.svg'
							width='20'
							height='20'
						/>
					</Link>

					<Link href='/'>
						<Image
							alt='Telegram Logo'
							src='/brand/telegram-grey.svg'
							width='20'
							height='20'
						/>
					</Link>

					<Link href='/'>
						<Image
							alt='Web Logo'
							src='/icons/web-grey.svg'
							width='20'
							height='20'
						/>
					</Link>
				</div>
			</footer>
		</nav>
	);
}

export default AppSidebar;
