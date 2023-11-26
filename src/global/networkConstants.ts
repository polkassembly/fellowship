// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Network, NetworkConstants } from '@/global/types';

const networkConstants: NetworkConstants = {
	[Network.POLKADOT]: {
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
	[Network.KUSAMA]: {
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
	},
	[Network.COLLECTIVES]: {
		name: 'Collectives',
		preImageBaseDeposit: '400000000000',
		blockTime: 12000,
		category: 'polkadot',
		logoUrl: '/parachain-logos/polkadot-logo.svg',
		ss58Format: 0,
		subsquidUrl: 'https://squid.subsquid.io/collectives-polkassembly/graphql',
		tokenDecimals: 10,
		tokenSymbol: 'DOT',
		subscanBaseUrl: 'https://kusama.api.subscan.io',
		rpcEndpoints: [
			{
				label: 'via Dotters',
				key: 'wss://sys.dotters.network/collectives-polkadot'
			}
		],
		relayRpcEndpoints: [
			{
				key: 'wss://1rpc.io/dot',
				label: 'Automata 1RPC'
			},
			{
				key: 'wss://polkadot-public-rpc.blockops.network/ws',
				label: 'BlockOps'
			},
			{
				key: 'wss://polkadot-rpc.dwellir.com',
				label: 'Dwellir'
			},
			{
				key: 'wss://polkadot-rpc-tn.dwellir.com',
				label: 'Dwellir Tunisia'
			},
			{
				key: 'wss://rpc.ibp.network/polkadot',
				label: 'IBP-GeoDNS1'
			},
			{
				key: 'wss://rpc.dotters.network/polkadot',
				label: 'IBP-GeoDNS2'
			},
			{
				key: 'wss://rpc-polkadot.luckyfriday.io',
				label: 'LuckyFriday'
			},
			{
				key: 'wss://polkadot.api.onfinality.io/public-ws',
				label: 'OnFinality'
			},
			{
				key: 'wss://rpc.polkadot.io',
				label: 'Parity'
			},
			{
				key: 'wss://polkadot.public.curie.radiumblock.co/ws',
				label: 'RadiumBlock'
			},
			{
				key: 'wss://dot-rpc.stakeworld.io',
				label: 'Stakeworld'
			}
		]
	}
};

export default networkConstants;
