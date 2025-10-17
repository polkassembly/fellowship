// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Listbox, ListboxItem } from '@nextui-org/listbox';
import { usePathname, useRouter } from 'next/navigation';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import styles from './Header.module.scss';
import LinkWithNetwork from '../Misc/LinkWithNetwork';
import { Home, Vote, Users, UserPlus, GitBranch, Image as ImageIcon, Shield, Settings } from 'lucide-react';

function ListboxItemStartContent({
	isParentItem = false,
	isCurrentRoute,
	icon
}: Readonly<{
	isParentItem: boolean;
	isCurrentRoute: boolean;
	icon?: React.ComponentType<{ className?: string }>;
}>) {
	const IconComponent = icon;
	return (
		<span className='flex items-center'>{IconComponent && <IconComponent className={`mr-3 h-5 w-5 ${isCurrentRoute ? 'text-primary_accent' : 'text-text_secondary'}`} />}</span>
	);
}

type NavItem = {
	label: string;
	icon?: React.ComponentType<{ className?: string }>;
	url: string;
	subItem?: boolean;
	childUrls?: string[];
};

/*
Note: The order of the items in this array is the order they will appear in the sidebar
subItems are will have to be a separate object in the array with a subItem property
due to the way the Listbox component works.
*/
const getNavItems = (isFellow: boolean, loginAddress?: string | null): NavItem[] => [
	{
		label: 'Overview',
		icon: Home,
		url: '/'
	},
	...(isFellow
		? [
				{
					label: 'Voting',
					icon: Vote,
					url: '/activity'
				}
			]
		: []),
	{
		label: 'Members',
		icon: Users,
		url: '/members'
	},
	{
		label: 'Inductions',
		icon: UserPlus,
		url: '/inductions'
	},
	{
		label: 'RFC Pull Requests',
		icon: GitBranch,
		url: '/rfc-pull-requests'
	},
	{
		label: 'Preimages',
		icon: ImageIcon,
		url: '/preimages'
	},
	...(!isFellow && loginAddress
		? [
				{
					label: 'Profile',
					icon: Shield,
					url: '/address'
				}
			]
		: []),
	{
		label: 'Settings',
		icon: Settings,
		url: '/settings'
	}
];

function AppSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const { network, fellows } = useApiContext();
	const { id, loginAddress, addresses } = useUserDetailsContext();

	// Check if current user is a fellow
	const isFellow = useMemo(() => {
		if (!id || !loginAddress || !fellows?.length) return false;
		const substrateAddress = getSubstrateAddress(loginAddress);
		return fellows.some((f: any) => f.address === substrateAddress);
	}, [loginAddress, fellows]);

	// Get navigation items based on fellow status
	const navItems = useMemo(() => getNavItems(isFellow, loginAddress ?? null), [isFellow, loginAddress]);

	return (
		<nav className={`${styles.appSidebar} overflow-y-auto overflow-x-hidden`}>
			<div>
				<div className='mb-3 flex flex-col gap-2'>
					<LinkWithNetwork
						href='/'
						className='flex items-center gap-2'
					>
						<div className='flex h-9 w-9 items-center justify-center'>
							<Image
								src='/icons/user-group.svg'
								alt='Collectives'
								width={36}
								height={36}
							/>
						</div>
						<h2 className='font-poppins text-base font-semibold text-primary_accent'>Collectives</h2>
					</LinkWithNetwork>
					<div className='flex items-center gap-2'>
						<span className='font-dm-sans text-nowrap text-xs text-text_secondary'>Governance by</span>
						<div className='flex items-center gap-2'>
							<Image
								src='/brand/pa-logo-dark-text.svg'
								alt='Polkassembly'
								width={92}
								height={30}
							/>
						</div>
					</div>
				</div>
				{/* <JoinFellowshipButton className='mb-5' /> */}

				<Listbox
					className='text-sm'
					variant='flat'
					aria-label='Sidebar navigation'
					selectedKeys={[pathname]}
					onAction={(key) => {
						if (key.toString().startsWith('#')) return;
						if (key.toString().startsWith('/address')) {
							if (!id) {
								router.push(`/login?network=${network}`);
								return;
							}
							router.push(`${key.toString()}/${loginAddress || addresses?.[0]}?network=${network}`);
							return;
						}
						router.push(`${key.toString().toLowerCase()}?network=${network}`);
					}}
				>
					{navItems.map((navItem) => {
						const isParentItem = Boolean(navItem.childUrls?.length);

						const pathnameLower = pathname.toLowerCase();
						let isCurrentRoute = pathnameLower === navItem.url || (pathnameLower.includes('/address') && navItem.url === '/address');
						if (navItem.childUrls?.includes(pathnameLower)) {
							isCurrentRoute = true;
						}

						return (
							<ListboxItem
								id='nav-listbox-item'
								className={`mb-3 rounded p-2 transition-colors ${
									isCurrentRoute && !isParentItem
										? 'border-l-4 border-primary_accent bg-primary_accent/10 font-semibold text-primary_accent'
										: 'hover:text-text_primary text-text_secondary hover:bg-gray-50'
								} ${isParentItem && isCurrentRoute && 'text-primary_accent'}`}
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
									<LinkWithNetwork
										className={`${navItem.subItem && !isCurrentRoute && 'ml-4'} ${isCurrentRoute && navItem.subItem && 'ml-2'}`}
										href={navItem.url === '/address' ? `${navItem.url}/${loginAddress || addresses?.[0]}` : navItem.url}
									>
										{navItem.label}
									</LinkWithNetwork>
								)}
							</ListboxItem>
						);
					})}
				</Listbox>
			</div>

			<footer className='flex flex-col gap-y-4'>
				<div className='ml-2 flex max-w-[150px] items-center justify-between gap-x-4'>
					<LinkWithNetwork
						href='https://twitter.com/polk_gov/'
						target='_black'
					>
						<Image
							alt='Tiwtter Logo'
							src='/brand/twitter-grey.svg'
							width='20'
							height='20'
						/>
					</LinkWithNetwork>

					<LinkWithNetwork
						href='https://discord.com/invite/CYmYWHgPha/'
						target='_black'
					>
						<Image
							alt='Discord Logo'
							src='/brand/discord-grey.svg'
							width='20'
							height='20'
						/>
					</LinkWithNetwork>

					<LinkWithNetwork
						href='https://t.me/+6WQDzi6RuIw3YzY1/'
						target='_black'
					>
						<Image
							alt='Telegram Logo'
							src='/brand/telegram-grey.svg'
							width='20'
							height='20'
						/>
					</LinkWithNetwork>

					<LinkWithNetwork
						href='https://polkassembly.medium.com/'
						target='_black'
					>
						<Image
							alt='Web Logo'
							src='/icons/web-grey.svg'
							width='20'
							height='20'
						/>
					</LinkWithNetwork>
				</div>
			</footer>
		</nav>
	);
}

export default AppSidebar;
