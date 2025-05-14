// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { Network } from '@/global/types';
import getEncodedAddress from '@/utils/getEncodedAddress';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import { hexToString, isHex } from '@polkadot/util';

export interface IIdentityCache {
	[key: string]: {
		identity: any;
		timestamp: number;
	};
}

export interface IOnChainIdentity {
	discord: string;
	display: string;
	displayParent: string;
	email: string;
	github: string;
	isGood: boolean;
	isIdentitySet: boolean;
	isVerified: boolean;
	judgements: any[];
	legal: string;
	matrix: string;
	nickname: string;
	parentProxyAddress: string;
	parentProxyTitle: string | null;
	twitter: string;
	verifiedByPolkassembly: boolean;
	web: string;
	hash?: string;
}

export class IdentityService {
	private static instance: IdentityService;
	private cache: IIdentityCache = {};
	private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

	private constructor() {}

	static getInstance(): IdentityService {
		if (!IdentityService.instance) {
			IdentityService.instance = new IdentityService();
		}
		return IdentityService.instance;
	}

	private getCachedIdentity(address: string): any | null {
		const formattedAddress = getSubstrateAddress(address) || address;
		if (!formattedAddress) return null;

		const cachedData = this.cache[formattedAddress];
		const now = Date.now();

		if (cachedData && now - cachedData.timestamp < this.CACHE_DURATION) {
			return cachedData.identity;
		}

		return null;
	}

	private setCachedIdentity(address: string, identity: any): void {
		const formattedAddress = getSubstrateAddress(address) || address;
		if (!formattedAddress) return;

		this.cache[formattedAddress] = {
			identity,
			timestamp: Date.now()
		};
	}

	private async getParentProxyInfo({ address, network, api }: { address: string; network: Network; api: ApiPromise }) {
		const encodedAddress = getEncodedAddress(address, network) || address;

		const proxyInfo = await api?.query?.identity?.superOf(encodedAddress);
		const formatedProxyInfo: any = proxyInfo?.toHuman();
		if (formatedProxyInfo && formatedProxyInfo?.[0] && getEncodedAddress(formatedProxyInfo?.[0] || '', network)) {
			return { address: formatedProxyInfo?.[0], title: formatedProxyInfo?.[1]?.Raw || null };
		}
		return { address: '', title: null };
	}

	private static processIdentityInfo(identityInfo: any): { isGood: boolean; unverified: boolean } {
		const infoCall =
			identityInfo?.judgements?.filter(([, judgement]: any[]): boolean => {
				return ['KnownGood', 'Reasonable'].includes(judgement);
			}) || [];

		const unverified = !infoCall?.length || !identityInfo?.judgements?.length;
		const isGood = identityInfo?.judgements.some(([, judgement]: any[]): boolean => {
			return ['KnownGood', 'Reasonable'].includes(judgement);
		});

		return { isGood, unverified };
	}

	async getOnChainIdentity(address: string, network: Network, api: ApiPromise): Promise<IOnChainIdentity | null> {
		if (!address || !api) return null;

		// Check cache first
		const cachedIdentity = this.getCachedIdentity(address);
		if (cachedIdentity) return cachedIdentity;

		const encodedQueryAddress = getEncodedAddress(address, network) || address;
		const parentProxyInfo = await this.getParentProxyInfo({ address: encodedQueryAddress, network, api });
		const encodedAddress = parentProxyInfo?.address ? getEncodedAddress(parentProxyInfo.address, network) : encodedQueryAddress;

		try {
			const identityInfoRes: any = await api?.query.identity?.identityOf(encodedAddress);

			const identityInfo = await (identityInfoRes?.toHuman()?.[0] || identityInfoRes?.toHuman?.());
			const identityHashInfo = await (identityInfoRes?.unwrapOr?.(null)?.[0] || identityInfoRes?.unwrapOr?.(null));

			const { isGood, unverified } = IdentityService.processIdentityInfo(identityInfo);

			const identity = identityInfo?.info;
			const identityHash = identityHashInfo?.info?.hash?.toHex();

			const result: IOnChainIdentity = {
				discord: identity?.discord?.Raw || '',
				display: isHex(identity?.display?.Raw || '') ? hexToString(identity?.display?.Raw) || identity?.display?.Raw || '' : identity?.display?.Raw || '',
				displayParent: identity?.displayParent?.Raw || '',
				email: identity?.email?.Raw || '',
				github: identity?.github?.Raw || '',
				isGood: isGood || false,
				isIdentitySet: !!identity?.display?.Raw,
				isVerified: !unverified,
				judgements: identityInfo?.judgements || [],
				legal: isHex(identity?.legal?.Raw || '') ? hexToString(identity?.legal?.Raw) || identity?.legal?.Raw || '' : identity?.legal?.Raw || '',
				matrix: identity?.matrix?.Raw || identity?.riot?.Raw || '',
				nickname: identity?.nickname?.Raw || '',
				parentProxyAddress: parentProxyInfo?.address || '',
				parentProxyTitle: parentProxyInfo?.title || null,
				twitter: identity?.twitter?.Raw || '',
				verifiedByPolkassembly: false, // TODO: Implement if needed
				web: identity?.web?.Raw || '',
				...(identityHash && { hash: identityHash })
			};

			this.setCachedIdentity(address, result);
			return result;
		} catch (error) {
			console.error('Error fetching identity:', error);
			return null;
		}
	}

	clearCache(): void {
		this.cache = {};
	}

	clearCacheForAddress(address: string): void {
		const formattedAddress = getSubstrateAddress(address) || address;
		if (formattedAddress) {
			delete this.cache[formattedAddress];
		}
	}
}
