// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Wallet } from '@/global/types';
import { Button } from '@nextui-org/button';
import React from 'react';
import Image from 'next/image';

interface Props {
	className?: string;
	onWalletClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, wallet: Wallet) => void;
	disabled?: boolean;
}

function WalletButtons({ className, onWalletClick, disabled = false }: Props) {
	return (
		<div className={`${className} flex items-center justify-center gap-3`}>
			{Object.values(Wallet).map(
				(wallet) =>
					Boolean(wallet) && (
						<Button
							key={wallet}
							className='border-1'
							variant='faded'
							color='primary'
							size='lg'
							isIconOnly
							onClick={(e) => onWalletClick?.(e, wallet)}
							disabled={disabled}
						>
							<Image
								src={`/icons/wallets/${wallet.toLowerCase()}.svg`}
								alt={wallet}
								width={28}
								height={28}
							/>
						</Button>
					)
			)}
		</div>
	);
}

export default WalletButtons;
