// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProposalType } from '@/global/types';
import firebaseAdmin from '@/services/firebaseInit';
import { postDocRef, postCommentsCollRef, postReactionCollRef, postViewsCollRef } from '../firestoreRefs';

async function getFirestoreDocs(onChainProposals: unknown[], network: string) {
	const proposalRefs: firebaseAdmin.firestore.DocumentReference<firebaseAdmin.firestore.DocumentData>[] = [];
	const commentCountRefs: any[] = [];
	const reactionRefs: Promise<firebaseAdmin.firestore.QuerySnapshot<firebaseAdmin.firestore.DocumentData>>[] = [];
	const viewCountRefs: any[] = [];

	onChainProposals.forEach((proposalObj: any) => {
		const postRef = postDocRef(network, ProposalType.FELLOWSHIP_REFERENDUMS, String(proposalObj.index));
		proposalRefs.push(postRef);

		const commentCountRef = postCommentsCollRef(network, ProposalType.FELLOWSHIP_REFERENDUMS, String(proposalObj.index)).count().get();
		commentCountRefs.push(commentCountRef);

		const reactionCollRef = postReactionCollRef(network, ProposalType.FELLOWSHIP_REFERENDUMS, String(proposalObj.index)).get();
		reactionRefs.push(reactionCollRef);

		const viewCountRef = postViewsCollRef(network, ProposalType.FELLOWSHIP_REFERENDUMS, String(proposalObj.index)).count().get();
		viewCountRefs.push(viewCountRef);
	});

	const firestoreProposalDocs = proposalRefs.length ? await firebaseAdmin.firestore().getAll(...proposalRefs) : [];
	const firestoreCommentCountDocs = proposalRefs.length ? (await Promise.allSettled(commentCountRefs)).map((item) => (item.status === 'fulfilled' ? item.value : 0)) : [];
	const firestoreReactionDocs = proposalRefs.length ? (await Promise.allSettled(reactionRefs)).map((item) => (item.status === 'fulfilled' ? item.value : null)) : [];
	const firestoreViewCountDocs = proposalRefs.length ? (await Promise.allSettled(viewCountRefs)).map((item) => (item.status === 'fulfilled' ? item.value : 0)) : [];

	return { firestoreProposalDocs, firestoreCommentCountDocs, firestoreReactionDocs, firestoreViewCountDocs };
}
export default getFirestoreDocs;
