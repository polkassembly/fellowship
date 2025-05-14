// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable react/destructuring-assignment */

'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import midTruncateText from '@/utils/midTruncateText';
import getEncodedAddress from '@/utils/getEncodedAddress';
import { useApiContext } from '@/contexts';
import AddressInline from './AddressInline';
import AddressDropdownItem from './AddressDropdownItem';
import { useIdentity } from '@/hooks/useIdentity';

interface BaseProps {
	className?: string;
	variant: 'inline' | 'dropdownItem';
	address: string;
	truncateCharLen?: number;
	iconSize?: number;
	showRank?: boolean;
}

interface AddressInlineProps extends BaseProps {
	variant: 'inline';
}

interface AddressDropdownItemProps extends BaseProps {
	variant: 'dropdownItem';
	name?: string;
}

type Props = AddressInlineProps | AddressDropdownItemProps;

function Address(props: Props) {
	const iconSize = props.iconSize || 20;
	const { network } = useApiContext();
	const { identity: onChainIdentity } = useIdentity(props.address);

	const encodedAddress = getEncodedAddress(props.address, network) || props.address;
	const onChainUsername = onChainIdentity?.displayParent || onChainIdentity?.display || '';

	const addressDisplayText = props.truncateCharLen
		? midTruncateText({
				text: encodedAddress,
				startChars: props.truncateCharLen,
				endChars: props.truncateCharLen
			})
		: encodedAddress;

	const truncatedUsername = props.truncateCharLen
		? midTruncateText({
				text: onChainUsername,
				startChars: 10,
				endChars: 10
			})
		: onChainUsername;

	switch (props.variant) {
		case 'inline':
			return (
				<AddressInline
					onChainIdentity={onChainIdentity}
					className={props.className}
					address={encodedAddress}
					addressDisplayText={truncatedUsername || addressDisplayText}
					iconSize={iconSize}
					showRank={props.showRank}
				/>
			);
		case 'dropdownItem':
			return (
				<AddressDropdownItem
					onChainIdentity={onChainIdentity}
					className={props.className}
					name={props.name || onChainUsername || ''}
					address={encodedAddress}
					addressDisplayText={addressDisplayText}
					iconSize={iconSize}
					showRank={props.showRank}
				/>
			);
		default:
			return null;
	}
}

export default Address;
