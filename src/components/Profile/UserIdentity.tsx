// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Address from './Address';

interface Props {
	address?: string;
	username?: string;
}

function UserIdentity({ address, username }: Props) {
	if (address) {
		return (
			<Address
				variant='inline'
				address={address}
				truncateCharLen={4}
			/>
		);
	}

	if (username) {
		return <small>{username}</small>;
	}
}

export default UserIdentity;
