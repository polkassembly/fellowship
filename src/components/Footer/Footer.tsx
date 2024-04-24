// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import styles from '@/components/Header/Header.module.scss';
import LinkWithNetwork from '../Misc/LinkWithNetwork';
import FooterNavItem from './FooterNavItem';

type subItem = { label: string; url: string };

type NavItem = {
	label: string;
	icon?: string;
	url: string;
	subItems?: subItem[];
	childUrls?: string[];
};

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
		subItems: [
			{
				label: 'General Proposals',
				url: '/general-proposals'
			},
			{
				label: 'Rank Requests',
				url: '/rank-requests'
			},
			{
				label: 'RFC Proposals',
				url: '/rfc-proposals'
			}
		],
		childUrls: ['/general-proposals', '/rank-requests', '/rfc-proposals']
	},
	{
		label: 'Members',
		icon: 'users',
		url: '/members'
	},
	{
		label: 'Profile',
		icon: 'shield-user',
		url: '/address'
	}
];

function FooterNavMobile() {
	const pathname = usePathname();
	const router = useRouter();
	const { network } = useApiContext();
	const { id, loginAddress, addresses } = useUserDetailsContext();

	const handleClickAction = (url: string) => {
		if (url.startsWith('#')) return;
		if (url.startsWith('/address')) {
			if (!id) {
				router.push(`/login?network=${network}`);
				return;
			}
			router.push(`${url}/${loginAddress || addresses?.[0]}?network=${network}`);
			return;
		}
		router.push(`${url.toLowerCase()}?network=${network}`);
	};

	return (
		<nav className={styles.footerNavMobile}>
			<div className='flex w-full items-center justify-evenly gap-5'>
				{navItems.map((navItem) => {
					const isParentItem = Boolean(navItem.childUrls?.length);

					const pathnameLower = pathname.toLowerCase();
					let isCurrentRoute = pathnameLower === navItem.url;
					if (navItem.childUrls?.includes(pathnameLower)) {
						isCurrentRoute = true;
					}

					return (
						<div
							id='nav-list-item'
							className={`mb-3 block h-[40px] rounded-none p-0 hover:bg-transparent ${isCurrentRoute && 'text-primary'}`}
							key={navItem.url}
						>
							<FooterNavItem
								isParentItem={isParentItem}
								isCurrentRoute={isCurrentRoute}
								icon={navItem.icon}
								subItems={navItem.subItems}
								url={navItem.url}
								handleClickAction={handleClickAction}
							>
								{navItem.url.startsWith('#') ? (
									<span>{navItem.label}</span>
								) : (
									<LinkWithNetwork href={navItem.url === '/address' ? `${navItem.url}/${loginAddress || addresses?.[0]}` : navItem.url}>{navItem.label}</LinkWithNetwork>
								)}
							</FooterNavItem>
						</div>
					);
				})}
			</div>
		</nav>
	);
}

export default FooterNavMobile;
