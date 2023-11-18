// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProposalStatus } from '../types';

const VOTABLE_STATUSES = [
	ProposalStatus.Proposed,
	ProposalStatus.Started,
	ProposalStatus.Submitted,
	ProposalStatus.Deciding,
	ProposalStatus.ConfirmStarted,
	ProposalStatus.DecisionDepositPlaced,
	ProposalStatus.ConfirmAborted
];

export default VOTABLE_STATUSES;
