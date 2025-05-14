// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { Network } from '@/global/types';
import getEncodedAddress from '@/utils/getEncodedAddress';
import getSubstrateAddress from '@/utils/getSubstrateAddress';

export interface IIdentityCache {
	[key: string]: {
		identity: any;
		timestamp: number;
	};
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

	async getOnChainIdentity(address: string, network: Network, api: ApiPromise): Promise<any> {
		if (!address || !api) return null;

		// Check cache first
		const cachedIdentity = this.getCachedIdentity(address);
		if (cachedIdentity) return cachedIdentity;

		const encodedAddress = getEncodedAddress(address, network) || address;
		if (!encodedAddress) return null;

		try {
			const identity = await api.derive.accounts.info(encodedAddress);
			this.setCachedIdentity(address, identity);
			return identity;
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
