// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Address from '@/components/Profile/Address';
import { IPreimage } from '@/global/types';
import midTruncateText from '@/utils/midTruncateText';

interface Props {
	className?: string;
	preimage: IPreimage;
	proposerAddress: string;
}

function PreimageDetails({ className, preimage, proposerAddress }: Props) {
	return (
		<section className={`${className} flex flex-col items-start justify-start gap-3`}>
			<h3 className='font-medium'>Preimage Details:</h3>

			<div className='grid w-[60%] grid-cols-2 grid-rows-4 gap-x-2 gap-y-2'>
				<div>Proposer Address:</div>
				<div className='font-medium'>
					<Address
						variant='inline'
						address={proposerAddress}
						truncateCharLen={4}
					/>
				</div>

				<div>Preimage Hash:</div>
				<div className='font-medium'>
					{midTruncateText({
						text: preimage.preimageHash,
						startChars: 6,
						endChars: 6
					})}
				</div>

				<div>Preimage Length:</div>
				<div className='font-medium'>{preimage.preimageLength}</div>

				<div>Preimage Link:</div>
				<div className='font-medium'>
					<a
						className='text-link hover:underline'
						href={`https://polkadot.polkassembly.io/preimages/${preimage.preimageHash}`}
						target='_blank'
						rel='noopener noreferrer'
					>
						https://polkadot.polkassembly.io/preimages/
						{midTruncateText({
							text: preimage.preimageHash,
							startChars: 3,
							endChars: 3
						})}
					</a>
				</div>
			</div>
		</section>
	);
}

export default PreimageDetails;
