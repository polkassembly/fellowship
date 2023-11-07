// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Network, Wallet } from '@/global/types';
import { Injected, InjectedAccount, InjectedWindow } from '@polkadot/extension-inject/types';
import APP_NAME from '@/global/constants/appName';
import getEncodedAddress from './getEncodedAddress';

interface Args {
	wallet: Wallet;
	network: Network;
	setExtensionNotFound?: (value: boolean) => void;
	setLoading?: (value: boolean) => void;
	setWalletError?: (value: string) => void;
	setAccountsNotFound?: (value: boolean) => void;
	setAccounts: (value: InjectedAccount[]) => void;
	setSelectedAddress: (value: InjectedAccount) => void;
}

/**
 * Returns InjectedAccount[] in setAccounts
 *
 * @param {Args} { wallet, network, setExtensionNotFound, setLoading, setWalletError, setAccountsNotFound, setAccounts, setSelectedAddress }
 * @return {*}
 */
const getWalletAccounts = async ({ wallet, network, setExtensionNotFound, setLoading, setWalletError, setAccountsNotFound, setAccounts, setSelectedAddress }: Args) => {
	const injectedWindow = window as Window & InjectedWindow;
	const injectedWallet = injectedWindow?.injectedWeb3?.[String(wallet)];

	if (!injectedWallet) {
		setExtensionNotFound?.(true);
		setLoading?.(false);
		return;
	}

	setExtensionNotFound?.(false);

	let injected: Injected | null = null;
	try {
		injected = await new Promise((resolve, reject) => {
			const timeoutId = setTimeout(() => {
				reject(new Error('Wallet Timeout'));
			}, 60000); // wait 60 sec

			if (injectedWallet && injectedWallet.enable) {
				injectedWallet
					.enable(APP_NAME)
					.then((value) => {
						clearTimeout(timeoutId);
						resolve(value);
					})
					.catch((error) => {
						reject(error);
					});
			}
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		setLoading?.(false);

		// eslint-disable-next-line no-console
		console.error('Error in getting injected: ', err?.message);

		if (err?.message === 'Rejected') {
			setWalletError?.('');
		} else if (err?.message === 'Pending authorisation request already exists for this site. Please accept or reject the request.') {
			setWalletError?.('Pending authorisation request already exists. Please accept or reject the request on the wallet extension and try again.');
		} else if (err?.message === 'Wallet Timeout') {
			setWalletError?.('Wallet authorisation timed out. Please accept or reject the request on the wallet extension and try again.');
		}
	}

	if (!injected) return;

	const injectedAccounts = await injected.accounts.get();
	if (injectedAccounts.length === 0) {
		setAccountsNotFound?.(true);
		setLoading?.(false);
		return;
	}

	setAccountsNotFound?.(false);

	const accountsLocal = injectedAccounts;

	accountsLocal.forEach((account, i) => {
		accountsLocal[Number(i)].address = getEncodedAddress(account.address, network) || account.address;
	});

	setAccounts?.(accountsLocal);

	if (accountsLocal.length > 0) {
		setSelectedAddress?.(accountsLocal[0]);
	}

	setLoading?.(false);
};

export default getWalletAccounts;
