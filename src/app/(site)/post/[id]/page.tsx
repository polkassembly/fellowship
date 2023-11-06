// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

interface Props {
	params: {
		id: string;
	};
}

function PostPage({ params: { id } }: Props) {
	return <div>PostPage {id}</div>;
}

export default PostPage;
