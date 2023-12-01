// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable react/destructuring-assignment */

'use client';

import React, { useEffect, useState } from 'react';
import midTruncateText from '@/utils/midTruncateText';
import getEncodedAddress from '@/utils/getEncodedAddress';
import { useApiContext } from '@/contexts';
import AddressInline from './AddressInline';
import AddressDropdownItem from './AddressDropdownItem';

interface BaseProps {
	className?: string;
	variant: 'inline' | 'dropdownItem';
	address: string;
	truncateCharLen?: number;
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
	const { network, relayApi, relayApiReady } = useApiContext();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [onChainIdentity, setOnChainIdentity] = useState<any>();

	const encodedAddress = getEncodedAddress(props.address, network) || props.address;
	const onChainUsername = onChainIdentity?.identity?.displayParent || onChainIdentity?.identity?.display || '';

	useEffect(() => {
		if (!relayApi || !relayApiReady) return;

		(async () => {
			const identity = await relayApi.derive.accounts.info(encodedAddress);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			setOnChainIdentity(identity as any);
		})();
	}, [encodedAddress, relayApi, relayApiReady]);

	const addressDisplayText = props.truncateCharLen
		? midTruncateText({
				text: onChainUsername || encodedAddress,
				startChars: props.truncateCharLen,
				endChars: props.truncateCharLen
		  })
		: encodedAddress;

	switch (props.variant) {
		case 'inline':
			return (
				<AddressInline
					className={props.className}
					address={encodedAddress}
					addressDisplayText={addressDisplayText}
				/>
			);
		case 'dropdownItem':
			return (
				<AddressDropdownItem
					className={props.className}
					name={props.name || onChainUsername || ''}
					address={encodedAddress}
					addressDisplayText={addressDisplayText}
				/>
			);
		default:
			return null;
	}
}

export default Address;
