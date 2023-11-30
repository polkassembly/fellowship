// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import '@polkadot/api-augment';

import { ApiPromise, WsProvider } from '@polkadot/api';
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ApiContextType, IFellow, Network } from '@/global/types';
import networkConstants from '@/global/networkConstants';
import queueNotification from '@/utils/queueNotification';
import getNetwork from '@/utils/getNetwork';
import getAllFellowAddresses from '@/utils/getAllFellowAddresses';

export const ApiContext: React.Context<ApiContextType> = React.createContext({} as ApiContextType);

interface ApiContextProviderProps {
	children?: ReactNode;
}

export function ApiContextProvider({ children }: ApiContextProviderProps): React.ReactElement {
	const currNetwork = getNetwork();

	const [api, setApi] = useState<ApiPromise>();
	const [apiReady, setApiReady] = useState(false);
	const [isApiLoading, setIsApiLoading] = useState(false);
	const [wsProvider, setWsProvider] = useState<string>(networkConstants[String(currNetwork)]?.rpcEndpoints?.[0]?.key || '');
	const [network, setNetwork] = useState<Network>(currNetwork);
	const [fellows, setFellows] = useState<IFellow[]>([]);

	const provider = useRef<WsProvider>();

	useEffect(() => {
		if (!network) return;

		provider.current = new WsProvider(networkConstants[String(network)]?.rpcEndpoints?.[0]?.key);

		setApiReady(false);
		setApi(undefined);
		if (!provider.current) return;

		setApi(new ApiPromise({ provider: provider.current }));
	}, [network, wsProvider]);

	useEffect(() => {
		if (!api) return;

		setIsApiLoading(true);

		const timer = setTimeout(async () => {
			queueNotification({
				header: 'Error!',
				message: 'RPC connection Timeout.',
				status: 'error'
			});

			setIsApiLoading(false);
			await api.disconnect();

			localStorage.removeItem('tracks');
			if (network) {
				setWsProvider(networkConstants[String(network)]?.rpcEndpoints?.[0]?.key);
			}
		}, 60000);

		api.on('error', async () => {
			clearTimeout(timer);
			queueNotification({
				header: 'Error!',
				message: 'RPC is not responding, please change RPC.',
				status: 'error'
			});
			setIsApiLoading(false);
			await api.disconnect();
			localStorage.removeItem('tracks');
			if (!network) return;
			setWsProvider(networkConstants[String(network)]?.rpcEndpoints?.[0]?.key);
		});

		api.isReady
			.then(async () => {
				clearTimeout(timer);
				setIsApiLoading(false);
				setApiReady(true);
				// eslint-disable-next-line no-console
				console.log('API ready');

				try {
					const value = api.consts.fellowshipReferenda.tracks.toJSON();
					localStorage.setItem('tracks', JSON.stringify(value));

					setFellows(await getAllFellowAddresses(api));
				} catch (error) {
					localStorage.removeItem('tracks');
				}
			})
			.catch(async (error) => {
				clearTimeout(timer);
				queueNotification({
					header: 'Error!',
					message: 'RPC connection error.',
					status: 'error'
				});
				setIsApiLoading(false);
				await api.disconnect();
				// eslint-disable-next-line no-console
				console.error(error);
				localStorage.removeItem('tracks');
				if (!network) return;
				setWsProvider(networkConstants[String(network)]?.rpcEndpoints?.[0]?.key);
			});

		// eslint-disable-next-line consistent-return
		return () => clearTimeout(timer);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [api]);

	const providerValue = useMemo(
		() => ({ api, apiReady, isApiLoading, setWsProvider, wsProvider, network, setNetwork, fellows }),
		[api, apiReady, isApiLoading, setWsProvider, wsProvider, network, setNetwork, fellows]
	);

	return <ApiContext.Provider value={providerValue}>{children}</ApiContext.Provider>;
}
