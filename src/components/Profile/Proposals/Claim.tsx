// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { useApiContext } from '@/contexts';
import useCurrentBlock from '@/hooks/useCurrentBlock';
import { Tooltip } from '@nextui-org/tooltip';
import { BN } from '@polkadot/util';
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

interface Props {
	showClaimButton: boolean;
}

const ZERO = new BN(0);

function Claim({ showClaimButton }: Props) {
	const currentBlock = useCurrentBlock();
	const { api, apiReady } = useApiContext();
	const [claimInfo, setClaimInfo] = useState({
		cycleStart: ZERO,
		registrationPeriod: ZERO
	});

	useEffect(() => {
		if (api && apiReady) {
			(async () => {
				try {
					const status = await api.query.fellowshipSalary.status();
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const statusValue = status.toJSON() as any;
					const registrationPeriod = api.consts.fellowshipSalary?.registrationPeriod;
					const cycleStart = statusValue?.cycleStart;
					setClaimInfo({
						cycleStart: new BN(cycleStart),
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						registrationPeriod: new BN(registrationPeriod.toJSON() as any)
					});
				} catch (error) {
					//
				}
			})();
		}
	}, [api, apiReady]);

	const isClaimBtnVisible = useMemo(() => {
		if (claimInfo?.cycleStart?.isZero() || claimInfo?.registrationPeriod?.isZero()) {
			return false;
		}
		if (!currentBlock) {
			return false;
		}
		const { cycleStart, registrationPeriod } = claimInfo;
		return cycleStart.add(registrationPeriod).lte(currentBlock);
	}, [claimInfo, currentBlock]);

	if (showClaimButton) {
		if (isClaimBtnVisible) {
			return (
				<button
					type='button'
					className='flex cursor-pointer items-center justify-center border-none bg-none outline-none disabled:cursor-not-allowed'
				>
					<Image
						alt='Claim Icon'
						src='/icons/claim.svg'
						width={24}
						height={24}
						className=''
					/>
				</button>
			);
		}
		return (
			<Tooltip
				className='bg-tooltip_background capitalize text-tooltip_foreground'
				content={<span>Payout period not started</span>}
			>
				<button
					type='button'
					className='flex cursor-pointer items-center justify-center border-none bg-none outline-none disabled:cursor-not-allowed'
					disabled
				>
					<Image
						alt='Claim Icon'
						src='/icons/claim.svg'
						width={24}
						height={24}
						className=''
					/>
				</button>
			</Tooltip>
		);
	}
	return null;
}

export default Claim;
