// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import * as React from 'react';
import ReactJson from 'react-json-view';
import classNames from 'classnames';
import { convertAnyHexToASCII } from '@/utils/decodingOnChainInfo';
import { useApiContext } from '@/contexts';

interface Props {
	className?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	postArguments: any;
}

function ArgumentsTableJSONView({ className, postArguments }: Props) {
	const { network } = useApiContext();
	if (postArguments) {
		const newArgs = convertAnyHexToASCII(postArguments, network);
		return (
			<div className={classNames(className, 'mt-8 max-w-[calc(100vw-700px)] overflow-auto')}>
				<h5 className='mb-5 text-base font-bold'>Proposed Calls</h5>
				<div className='json-view'>
					<ReactJson
						src={newArgs}
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
