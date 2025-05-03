// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import CastVoteCard from './CastVoteCard';
import VoteInfoCard from './VoteInfoCard';
import DecisionStatusCard from './DecisionStatusCard';
function GovernanceSidebar() {
	return (
		<section className='flex flex-col gap-6'>
			<CastVoteCard />
			<DecisionStatusCard />
			<VoteInfoCard />
		</section>
	);
}

export default GovernanceSidebar;
