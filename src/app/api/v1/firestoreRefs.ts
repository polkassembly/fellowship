// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProposalType } from '@/global/types';
import { firestoreDB } from '@/services/firebaseInit';

export const networkDocRef = (networkName: string) => firestoreDB.collection('networks').doc(networkName);

export const usersCollRef = () => firestoreDB.collection('users');
export const userDocRef = (userId: number) => usersCollRef().doc(String(userId));

export const addressesCollRef = () => firestoreDB.collection('addresses');
export const addressDocRef = (address: string) => addressesCollRef().doc(address);
export const postsCollRef = (networkName: string, proposalType: ProposalType) => networkDocRef(networkName).collection('post_types').doc(String(proposalType)).collection('posts');

export const postDocRef = (networkName: string, proposalType: ProposalType, postId: string) => postsCollRef(networkName, proposalType).doc(postId);

export const postReactionCollRef = (networkName: string, proposalType: ProposalType, postId: string) => postDocRef(networkName, proposalType, postId).collection('post_reactions');

export const postCommentsCollRef = (networkName: string, proposalType: ProposalType, postId: string) => postDocRef(networkName, proposalType, postId).collection('comments');

export const commentReactionCollRef = (networkName: string, proposalType: ProposalType, postId: string, commentId: string) =>
	postCommentsCollRef(networkName, proposalType, postId).doc(commentId).collection('reactions');

export const commentRepliesCollRef = (networkName: string, proposalType: ProposalType, postId: string, commentId: string) =>
	postCommentsCollRef(networkName, proposalType, postId).doc(commentId).collection('replies');
