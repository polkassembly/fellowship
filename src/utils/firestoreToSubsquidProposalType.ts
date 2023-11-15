// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-explicit-any */

import { SubsquidProposalType, ProposalType } from '@/global/types';

export default function firestoreToSubsquidProposalType(firestoreProposalType: string): string | null {
	if (!Object.values(ProposalType).includes(firestoreProposalType as any)) return null;

	const keyName = Object.keys(ProposalType)[Object.values(ProposalType).indexOf(firestoreProposalType as ProposalType)];
	return SubsquidProposalType[keyName as keyof typeof SubsquidProposalType];
}
