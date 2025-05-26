// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useEffect, useState } from 'react';
import { useApiContext } from '@/contexts';
import { IdentityService, IOnChainIdentity } from '@/services/identity.service';

export const useIdentity = (address: string) => {
	const { network, peopleApi, peopleApiReady } = useApiContext();
	const [identity, setIdentity] = useState<IOnChainIdentity | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (!peopleApi || !peopleApiReady || !address) return;

		const fetchIdentity = async () => {
			setLoading(true);
			setError(null);
			try {
				const identityService = IdentityService.getInstance();
				const result = await identityService.getOnChainIdentity(address, network, peopleApi);
				setIdentity(result);
			} catch (err) {
				setError(err instanceof Error ? err : new Error('Failed to fetch identity'));
			} finally {
				setLoading(false);
			}
		};

		fetchIdentity();
	}, [address, network, peopleApi, peopleApiReady]);

	return {
		identity,
		loading,
		error
	};
};
