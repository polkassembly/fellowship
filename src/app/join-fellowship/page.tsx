// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import JoinFellowshipForm from '@/components/Misc/JoinFellowshipForm';

export default async function JoinFellowship() {
	return (
		<div className='rounded-2xl border border-primary_border p-6'>
			<JoinFellowshipForm />
		</div>
	);
}
