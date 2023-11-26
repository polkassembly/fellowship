// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IPreimage } from '@/global/types';
import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { BN, BN_ZERO } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';
import { HexString } from '@polkadot/util/types';

const EMPTY_HASH = blake2AsHex('');

export default function getPreimage(api: ApiPromise, proposal: SubmittableExtrinsic<'promise'>): IPreimage {
	let preimageHash = EMPTY_HASH;
	let encodedProposal: HexString | null = null;
	let preimageLength = 0;
	let notePreimageTx: SubmittableExtrinsic<'promise'> | null = null;
	let storageFee = BN_ZERO;

	encodedProposal = proposal?.method.toHex();
	preimageLength = !encodedProposal?.length ? 0 : Math.ceil((encodedProposal.length - 2) / 2);
	preimageHash = blake2AsHex(encodedProposal);
	notePreimageTx = api.tx.preimage.notePreimage(encodedProposal);

	// we currently don't have a constant exposed, however match to Substrate
	storageFee = ((api?.consts?.preimage?.baseDeposit || BN_ZERO) as unknown as BN).add(((api.consts.preimage?.byteDeposit || BN_ZERO) as unknown as BN).muln(preimageLength));

	return {
		encodedProposal,
		notePreimageTx,
		preimageHash,
		preimageLength,
		storageFee
	};
}
