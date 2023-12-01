// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import * as React from 'react';
import ReactJson from 'react-json-view';
import classNames from 'classnames';

interface Props {
	className?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	postArguments: any;
}

function ArgumentsTableJSONView({ className, postArguments }: Props) {
	if (postArguments) {
		return (
			<div className={classNames(className, 'mt-8')}>
				<h5 className='mb-5 text-base font-bold'>Proposed Calls</h5>
				<div className='json-view'>
					<ReactJson
						src={postArguments}
						iconStyle='circle'
						enableClipboard={false}
						displayDataTypes={false}
					/>
				</div>
			</div>
		);
	}
	return <div />;
}

export default ArgumentsTableJSONView;
