// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import ContributionGraph from '../../../components/Profile/Activity/ContributionGraph';

async function Home() {
	return (
		<div className='container mx-auto p-4'>
			<ContributionGraph />
		</div>
	);
}

export default Home;
