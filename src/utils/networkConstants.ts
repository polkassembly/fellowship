// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Networks } from '@/global/types';

const networkConstants: Networks = {
	polkadot: {
		name: 'Polkadot',
		blockTime: 6000,
		category: 'polkadot',
		logoUrl: '/parachain-logos/polkadot-logo.svg',
		ss58Format: 0,
		subsquidUrl: 'https://squid.subsquid.io/polkadot-polkassembly/graphql',
		tokenDecimals: 10,
		tokenSymbol: 'DOT',
		subscanBaseUrl: 'https://polkadot.api.subscan.io',
		rpcEndpoints: [
			{
				label: 'via Parity',
				key: 'wss://rpc.polkadot.io'
			},
			{
				label: 'via On-finality',
				key: 'wss://polkadot.api.onfinality.io/public-ws'
			},
			{
				label: 'via Dwellir',
				key: 'wss://polkadot-rpc.dwellir.com'
			},
			{
				label: 'via Pinknode',
				key: 'wss://public-rpc.pinknode.io/polkadot'
			},
			{
				label: 'via IBP-GeoDNS1',
				key: 'wss://rpc.ibp.network/polkadot'
			},
			{
				label: 'via IBP-GeoDNS2',
				key: 'wss://rpc.dotters.network/polkadot'
			},
			{
				label: 'via RadiumBlock',
				key: 'wss://polkadot.public.curie.radiumblock.co/ws'
			},
			{
				label: 'via LuckyFriday',
				key: 'wss://rpc-polkadot.luckyfriday.io'
			}
		]
	},
	kusama: {
		name: 'Kusama',
		blockTime: 6000,
		category: 'kusama',
		logoUrl: '/parachain-logos/kusama-logo.svg',
		ss58Format: 2,
		subsquidUrl: 'https://squid.subsquid.io/kusama-polkassembly/graphql',
		tokenDecimals: 12,
		tokenSymbol: 'KSM',
		subscanBaseUrl: 'https://kusama.api.subscan.io',
		rpcEndpoints: [
			{
				label: 'via Parity',
				key: 'wss://kusama-rpc.polkadot.io'
			},
			{
				label: 'via On-finality',
				key: 'wss://kusama.api.onfinality.io/public-ws'
			},
			{
				label: 'via Dwellir',
				key: 'wss://kusama-rpc.dwellir.com'
			},
			{
				label: 'via IBP-GeoDNS1',
				key: 'wss://rpc.ibp.network/kusama'
			},
			{
				label: 'via IBP-GeoDNS2',
				key: 'wss://rpc.dotters.network/kusama'
			},
			{
				label: 'via RadiumBlock',
				key: 'wss://kusama.public.curie.radiumblock.co/ws'
			},
			{
				label: 'via LuckyFriday',
				key: 'wss://rpc-kusama.luckyfriday.io'
			}
		]
	}
};

export default networkConstants;
