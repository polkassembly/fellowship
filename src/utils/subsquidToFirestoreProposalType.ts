// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-explicit-any */

import { SubsquidProposalType, ProposalType } from '@/global/types';

export default function subsquidToFirestoreProposalType(subsquidProposalType: string): string | null {
	if (!Object.values(SubsquidProposalType).includes(subsquidProposalType as any)) return null;

	const keyName = Object.keys(SubsquidProposalType)[Object.values(SubsquidProposalType).indexOf(subsquidProposalType as SubsquidProposalType)];
	return ProposalType[keyName as keyof typeof ProposalType];
}
