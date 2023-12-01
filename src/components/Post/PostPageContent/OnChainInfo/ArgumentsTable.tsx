// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TableBody, TableCell, TableRow } from '@nextui-org/table';
import React from 'react';

interface IArgumentsTableProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	argumentsJSON: any;
}

const urlRegex = /(https?:\/\/[^\s]+)/g;

const constructAnchorTag = (value: string) => {
	if (value && typeof value === 'string') {
		const urls = value.match(urlRegex);
		if (urls && Array.isArray(urls)) {
			urls?.forEach((url) => {
				if (url && typeof url === 'string') {
					// eslint-disable-next-line no-param-reassign
					value = value.replace(url, `<a class="text-pink_primary" href='${url}' target='_blank'>${url}</a>`);
				}
			});
		}
	}
	return value;
};

function ArgumentsTable({ argumentsJSON }: IArgumentsTableProps) {
	if (!argumentsJSON) return null;
	return (
		<TableBody>
			{Object.entries(argumentsJSON).map(([name, value], index) => {
				// eslint-disable-next-line no-tabs
				return (
					<TableRow
						className='grid grid-cols-12'
						// eslint-disable-next-line react/no-array-index-key
						key={index}
					>
						<TableCell className='col-span-4'>{name}</TableCell>
						{typeof value !== 'object' ? (
							<TableCell>
								<div
									className='col-span-8'
									// eslint-disable-next-line react/no-danger
									dangerouslySetInnerHTML={{
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										__html: constructAnchorTag(value as any)
									}}
								/>
							</TableCell>
						) : (
							<TableCell className='col-span-8'>
								<ArgumentsTable argumentsJSON={value} />
							</TableCell>
						)}
					</TableRow>
				);
			})}
		</TableBody>
	);
}

export default ArgumentsTable;
