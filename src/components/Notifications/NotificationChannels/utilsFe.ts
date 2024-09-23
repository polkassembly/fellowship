// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { NOTIFICATION_ENGINE_API_KEY } from '@/global/apiKeys';

export const FIREBASE_FUNCTIONS_URL = 'https://us-central1-polkasafe-a8042.cloudfunctions.net';

export const firebaseFunctionsHeader = (network: string, address?: string) => ({
	Accept: 'application/json',
	'Content-Type': 'application/json',
	'x-address': localStorage.getItem('loginAddress') || address || '',
	'x-api-key': NOTIFICATION_ENGINE_API_KEY,
	'x-network': network,
	'x-source': 'polkassembly'
});
