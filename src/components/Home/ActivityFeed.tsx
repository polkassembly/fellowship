// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import PostListingCard from './PostListingCard';
import InductionListingCard from './InductionListingCard';

// This will be an async component that gets a list of activities from the server
// It'll display different activity cards depending on the type of activity

function ActivityFeed() {
	return (
		<section className='flex max-h-screen w-full flex-col gap-y-4 overflow-auto'>
			<PostListingCard />
			<InductionListingCard />
		</section>
	);
}

export default ActivityFeed;
