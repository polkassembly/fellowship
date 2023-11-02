// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable no-console */

import { FIREBASE_SERVICE_ACC_CONFIG } from '@/global/apiKeys';
import * as firebaseAdmin from 'firebase-admin';

if (!FIREBASE_SERVICE_ACC_CONFIG) {
	throw new Error('Internal Error: FIREBASE_SERVICE_ACC_CONFIG missing.');
}

const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACC_CONFIG) as firebaseAdmin.ServiceAccount;

try {
	firebaseAdmin.initializeApp({
		credential: firebaseAdmin.credential.cert(serviceAccount)
	});
	console.log('Firebase admin Initialized.');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error: any) {
	// Skipping the "already exists" message which is not an actual error when we're hot-reloading.
	if (!/already exists/u.test(error.message)) {
		console.error('Firebase admin initialization error : ', error);
	}
}

export const firestoreDB = firebaseAdmin.firestore();

export default firebaseAdmin;
