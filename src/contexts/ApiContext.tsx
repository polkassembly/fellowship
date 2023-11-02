// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import '@polkadot/api-augment';

import { ApiPromise, ScProvider, WsProvider } from '@polkadot/api';
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Network } from '@/global/types';
import networkConstants from '@/global/networkConstants';
import queueNotification from '@/utils/queueNotification';

export interface ApiContextType {
	api: ApiPromise | undefined;
	apiReady: boolean;
	relayApi?: ApiPromise;
	relayApiReady?: boolean;
	isApiLoading: boolean;
	wsProvider: string;
	setWsProvider: React.Dispatch<React.SetStateAction<string>>;
}

export const ApiContext: React.Context<ApiContextType> = React.createContext({} as ApiContextType);

export interface ApiContextProviderProps {
	network?: Network;
	children?: ReactNode;
}

export function ApiContextProvider({ network = Network.COLLECTIVES, children }: ApiContextProviderProps): React.ReactElement {
	const currentNetworkRpcEndpoint = networkConstants[String(network)]?.rpcEndpoints?.[0]?.key || '';

	const [api, setApi] = useState<ApiPromise>();
	const [apiReady, setApiReady] = useState(false);
	const [relayApi, setRelayApi] = useState<ApiPromise>();
	const [relayApiReady, setRelayApiReady] = useState(false);
	const [isApiLoading, setIsApiLoading] = useState(false);
	const [wsProvider, setWsProvider] = useState<string>(currentNetworkRpcEndpoint);

	const provider = useRef<ScProvider | WsProvider | null>(null);

	useEffect(() => {
		if (network !== Network.COLLECTIVES) return;

		ApiPromise.create({
			provider: new WsProvider((networkConstants[String(network)]?.rpcEndpoints || []).map((endpoint) => endpoint.key))
		})
			.then((apiLocal) => setRelayApi(apiLocal))
			// eslint-disable-next-line no-console
			.catch(console.error);
	}, [network]);

	useEffect(() => {
		if (network !== Network.COLLECTIVES || !relayApi) return;

		relayApi.on('connected', () => setRelayApiReady(true));
		relayApi.on('disconnected', () => setRelayApiReady(false));
		relayApi.on('error', () => setRelayApiReady(false));
		relayApi.isReady
			.then(() => {
				setRelayApiReady(true);
			})
			.catch(() => {
				setRelayApiReady(false);
			});
	}, [network, relayApi]);

	useEffect(() => {
		if (!wsProvider && !network) return;

		provider.current = new WsProvider(wsProvider || currentNetworkRpcEndpoint);

		setApiReady(false);
		setApi(undefined);
		if (!provider.current) return;

		setApi(new ApiPromise({ provider: provider.current }));
	}, [currentNetworkRpcEndpoint, network, wsProvider]);

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
				setWsProvider(currentNetworkRpcEndpoint);
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
			setWsProvider(currentNetworkRpcEndpoint);
		});

		api.isReady
			.then(() => {
				clearTimeout(timer);
				setIsApiLoading(false);
				setApiReady(true);
				// eslint-disable-next-line no-console
				console.log('API ready');

				try {
					if (network === 'collectives') {
						const value = api.consts.fellowshipReferenda.tracks.toJSON();
						localStorage.setItem('tracks', JSON.stringify(value));
					}
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
				setWsProvider(currentNetworkRpcEndpoint);
			});

		// eslint-disable-next-line consistent-return
		return () => clearTimeout(timer);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [api]);

	const providerValue = useMemo(
		() => ({ api, apiReady, isApiLoading, relayApi, relayApiReady, setWsProvider, wsProvider }),
		[api, apiReady, isApiLoading, relayApi, relayApiReady, setWsProvider, wsProvider]
	);

	return <ApiContext.Provider value={providerValue}>{children}</ApiContext.Provider>;
}
