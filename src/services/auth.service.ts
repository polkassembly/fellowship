// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable camelcase */

import { decodeToken } from 'react-jwt';

import { JWTPayloadType, UserDetailsContextType } from '@/global/types';

/**
 * Store the JWT token in localstorage
 * @param token the token received from the authentication header
 */
export const storeLocalStorageToken = (token: string) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem('Authorization', token);
	}
};

/**
 * Get the the jwt from localstorage
 * if any. It might be expired
 */
export const getLocalStorageToken = (): string | null => {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('Authorization') || null;
	}

	return null;
};

/**
 * Remove the the jwt from localstorage
 * if any.
 */
export const deleteLocalStorageToken = (): void => {
	if (typeof window !== 'undefined') {
		localStorage.removeItem('Authorization');
	}
};

/**
 * Store the user information in local context and call the function to store the received token
 * @param token answered by the auth server
 * @param currentUser context data on the user
 */
export const handleTokenChange = (token: string, currentUser: UserDetailsContextType) => {
	if (token) storeLocalStorageToken(token);
	try {
		const tokenPayload = token && decodeToken<JWTPayloadType>(token);

		if (tokenPayload && tokenPayload.sub) {
			const {
				addresses,
				default_address,
				roles,
				sub: id,
				username,
				email,
				email_verified,
				web3signup,
				is2FAEnabled = false,
				login_address,
				login_wallet
			} = tokenPayload as JWTPayloadType;

			currentUser.setUserDetailsContextState((prevState) => {
				return {
					...prevState,
					addresses,
					allowed_roles: roles.allowedRoles,
					defaultAddress: default_address,
					email,
					email_verified,
					id: Number(id),
					is2FAEnabled,
					loginAddress: login_address || currentUser?.loginAddress || '',
					loginWallet: login_wallet || currentUser.loginWallet || prevState.loginWallet,
					username,
					web3signup
				};
			});
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
	}
};

export const logout = (setUserDetailsContextState: UserDetailsContextType['setUserDetailsContextState']) => {
	deleteLocalStorageToken();
	localStorage.removeItem('delegationDashboardAddress');
	localStorage.removeItem('delegationWallet');
	localStorage.removeItem('loginWallet');
	localStorage.removeItem('loginAddress');
	localStorage.removeItem('identityWallet');
	localStorage.removeItem('identityAddress');
	localStorage.removeItem('identityForm');

	setUserDetailsContextState((prevState) => {
		return {
			...prevState,
			addresses: [],
			allowed_roles: [],
			defaultAddress: null,
			email: null,
			email_verified: false,
			id: null,
			loginAddress: '',
			loginWallet: null,
			networkPreferences: {
				channelPreferences: {},
				triggerPreferences: {}
			},
			username: null,
			web3signup: false
		};
	});
};
