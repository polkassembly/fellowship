// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUserDetailsContext } from '@/contexts';
import { Listbox, ListboxItem } from '@nextui-org/listbox';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/popover';
import LinkWithNetwork from '../Misc/LinkWithNetwork';

interface IFooterNavItem {
	isParentItem: boolean;
	isCurrentRoute: boolean;
	icon?: string;
	url: string;
	children: React.ReactNode;
	subItems?: { label: string; url: string; icon?: string }[];
	handleClickAction: (url: string) => void;
}

function FooterNavItem({ isParentItem = false, isCurrentRoute, icon, children, subItems, url, handleClickAction }: IFooterNavItem) {
	const pathname = usePathname();
	const { loginAddress, addresses } = useUserDetailsContext();
	const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

	return (
		<div className='flex flex-col items-center justify-between'>
			<button
				type='button'
				className={`m-0 flex flex-col items-center gap-0.5 p-0 text-xs ${isCurrentRoute ? 'text-primary' : 'text-white'}`}
				onClick={() => handleClickAction(url)}
			>
				{isParentItem && subItems && Boolean(subItems?.length) ? (
					<Popover
						isOpen={isPopoverOpen}
						onOpenChange={(open) => setIsPopoverOpen(open)}
						placement='top'
					>
						<PopoverTrigger>
							<div className='flex flex-col items-center'>
								{icon && (
									<Image
										alt='icon'
										className='m-0'
										src={`/icons/sidebar/${icon}${isCurrentRoute ? '-filled' : '-outlined'}.svg`}
										width={20}
										height={20}
									/>
								)}
								<span className={isCurrentRoute ? '' : 'mt-1'}>{children}</span>
							</div>
						</PopoverTrigger>
						<PopoverContent className='mb-3 overflow-hidden p-0 py-2'>
							<Listbox
								className='p-0 text-sm'
								variant='flat'
								color='primary'
								aria-label='Sidebar navigation'
								selectedKeys={[pathname]}
							>
								{subItems?.map((subItem) => {
									const subItemPathname = subItem.url.toLowerCase();
									const pathnameLower = pathname.toLowerCase();
									const isSubItemCurrentRoute = subItemPathname === pathnameLower;

									return (
										<ListboxItem
											id='nav-list-subItem'
											textValue={subItem.label}
											className={`h-[40px] rounded-none px-4 hover:bg-transparent ${isSubItemCurrentRoute && 'bg-selectedRadioBg text-primary'}`}
											key={subItem.url}
											onClick={() => {
												setIsPopoverOpen(false);
												handleClickAction(subItem.url);
											}}
										>
											<div className='flex items-center gap-2'>
												{subItem.icon && (
													<Image
														alt='icon'
														className='m-0'
														src={`/icons/sidebar/${subItem?.icon}${isSubItemCurrentRoute ? '-filled' : '-outlined'}.svg`}
														width={20}
														height={20}
													/>
												)}

												{subItem.url.startsWith('#') ? (
													<span>{subItem.label}</span>
												) : (
													<LinkWithNetwork href={subItem.url === '/address' ? `${subItem.url}/${loginAddress || addresses?.[0]}` : subItem.url}>{subItem.label}</LinkWithNetwork>
												)}
											</div>
										</ListboxItem>
									);
								})}
							</Listbox>
						</PopoverContent>
					</Popover>
				) : (
					<>
						{icon && (
							<Image
								alt='icon'
								className='m-0'
								src={`/icons/sidebar/${icon}${isCurrentRoute ? '-filled' : '-outlined'}.svg`}
								width={20}
								height={20}
							/>
						)}
						{children}
					</>
				)}
			</button>
			{isCurrentRoute && (
				<Image
					alt='border-image'
					src='/misc/border-bottom-pink.svg'
					width={48}
					height={6}
					className='mb-[-8px] mt-1'
				/>
			)}
		</div>
	);
}

export default FooterNavItem;
