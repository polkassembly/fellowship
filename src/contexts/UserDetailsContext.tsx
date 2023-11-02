// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable camelcase */
import React, { createContext, useCallback, useMemo, useState } from 'react';
import { decodeToken } from 'react-jwt';

import { JWTPayloadType, UserDetailsContextType } from '@/global/types';
import { getLocalStorageToken } from '../services/auth.service';

const initialUserDetailsContext: UserDetailsContextType = {
	addresses: [],
	allowed_roles: [],
	defaultAddress: '',
	delegationDashboardAddress: '',
	email: null,
	email_verified: false,
	id: null,
	is2FAEnabled: false,
	isLoggedOut: (): boolean => {
		throw new Error('isLoggedOut function must be overridden');
	},
	loginAddress: '',
	loginWallet: null,
	multisigAssociatedAddress: '',
	networkPreferences: {
		channelPreferences: {},
		triggerPreferences: {}
	},
	picture: null,
	primaryNetwork: '',
	setUserDetailsContextState: (): void => {
		throw new Error('setUserDetailsContextState function must be overridden');
	},
	username: null,
	web3signup: false
};

const accessToken = getLocalStorageToken();
try {
	const tokenPayload = accessToken && decodeToken<JWTPayloadType>(accessToken);

	if (tokenPayload && tokenPayload.sub) {
		const {
			addresses,
			default_address,
			is2FAEnabled = false,
			roles,
			sub: id,
			username,
			email,
			email_verified,
			web3signup,
			login_address,
			login_wallet
		} = tokenPayload as JWTPayloadType;

		if (id) {
			initialUserDetailsContext.id = Number(id);
		}
		if (username) {
			initialUserDetailsContext.username = username;
		}
		if (email) {
			initialUserDetailsContext.email = email;
		}
		initialUserDetailsContext.email_verified = email_verified || false;

		initialUserDetailsContext.addresses = addresses;
		initialUserDetailsContext.defaultAddress = default_address;
		initialUserDetailsContext.allowed_roles = roles.allowedRoles;
		initialUserDetailsContext.web3signup = web3signup || false;
		initialUserDetailsContext.is2FAEnabled = is2FAEnabled;
		initialUserDetailsContext.loginAddress = login_address || window?.localStorage?.getItem('loginAddress') || '';
		initialUserDetailsContext.loginWallet = login_wallet || null;
	}
} catch {
	// do nothing, the user will be authenticated as soon as there's a new call to the server.
}

export const UserDetailsContext = createContext(initialUserDetailsContext);

export function UserDetailsProvider({ children }: React.PropsWithChildren<object>) {
	const [userDetailsContextState, setUserDetailsContextState] = useState(initialUserDetailsContext);

	const isLoggedOut = useCallback(() => {
		return userDetailsContextState.id === null || userDetailsContextState.id === undefined;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const providerValue = useMemo(() => ({ ...userDetailsContextState, isLoggedOut, setUserDetailsContextState }), [isLoggedOut, userDetailsContextState]);

	return <UserDetailsContext.Provider value={providerValue}>{children}</UserDetailsContext.Provider>;
}
