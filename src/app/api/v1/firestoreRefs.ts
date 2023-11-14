// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProposalType } from '@/global/types';
import { firestoreDB } from '@/services/firebaseInit';

export const networkDocRef = (networkName: string) => firestoreDB.collection('networks').doc(networkName);
export const postsCollRef = (networkName: string, proposalType: ProposalType) => networkDocRef(networkName).collection('post_types').doc(String(proposalType)).collection('posts');
export const postDocRef = (networkName: string, proposalType: ProposalType, postId: string) => postsCollRef(networkName, proposalType).doc(postId);
export const postCommentsRef = (networkName: string, proposalType: ProposalType, postId: string) => postDocRef(networkName, proposalType, postId).collection('comments');
