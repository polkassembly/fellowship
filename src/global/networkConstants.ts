// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Network, NetworkConstants } from '@/global/types';

const networkConstants: NetworkConstants = {
	[Network.COLLECTIVES]: {
		key: Network.COLLECTIVES,
		name: 'Collectives',
		preImageBaseDeposit: '40000000000',
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
				key: 'wss://rpc.ibp.network/polkadot',
				label: 'IBP-GeoDNS1'
			},
			{
				key: 'wss://polkadot-rpc.dwellir.com',
				label: 'Dwellir'
			},
			{
				key: 'wss://polkadot.api.onfinality.io/public-ws',
				label: 'OnFinality'
			},
			{
				key: 'wss://1rpc.io/dot',
				label: 'Automata 1RPC'
			},
			{
				key: 'wss://polkadot-public-rpc.blockops.network/ws',
				label: 'BlockOps'
			},
			{
				key: 'wss://polkadot-rpc-tn.dwellir.com',
				label: 'Dwellir Tunisia'
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
	},
	[Network.WESTEND_COLLECTIVES]: {
		key: Network.WESTEND_COLLECTIVES,
		name: 'Westend Collectives',
		preImageBaseDeposit: '40000000000',
		blockTime: 6000,
		category: 'solo',
		logoUrl: '/parachain-logos/westend-logo.svg',
		ss58Format: 0,
		subsquidUrl: 'https://squid.subsquid.io/westend-collectives/graphql',
		tokenDecimals: 12,
		tokenSymbol: 'WND',
		subscanBaseUrl: 'https://westend.api.subscan.io',
		rpcEndpoints: [
			{
				label: 'via Dwellir',
				key: 'wss://westend-collectives-rpc.dwellir.com'
			},
			{
				label: 'via IBP',
				key: 'wss://sys.ibp.network/collectives-westend'
			}
		],
		relayRpcEndpoints: [
			{
				key: 'wss://polkadot-rpc.dwellir.com',
				label: 'Dwellir'
			},
			{
				key: 'wss://polkadot.api.onfinality.io/public-ws',
				label: 'OnFinality'
			},
			{
				key: 'wss://1rpc.io/dot',
				label: 'Automata 1RPC'
			},
			{
				key: 'wss://polkadot-public-rpc.blockops.network/ws',
				label: 'BlockOps'
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
