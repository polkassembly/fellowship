// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { BN } from '@polkadot/util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function getTxFee(api: ApiPromise, txArr: SubmittableExtrinsic<'promise', any>[], signerAddress: string) {
	const info = await (txArr.length > 1 ? api.tx.utility.batchAll(txArr).paymentInfo(signerAddress) : txArr[0].paymentInfo(signerAddress));
	const gasFee: BN = new BN(info.partialFee);

	return gasFee;
}
