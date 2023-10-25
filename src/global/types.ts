// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export type TRPCEndpoint = {
	key: string;
	label: string;
};

export type NetworkProperties = {
	blockTime: number;
	logoUrl: string;
	ss58Format: number;
	tokenDecimals: number;
	tokenSymbol: string;
	category: string;
	subsquidUrl: string;
	subscanBaseUrl: string;
	rpcEndpoints: TRPCEndpoint[];
	name: string; // to store alphabetical case
};

export type Networks = {
	[index: string]: NetworkProperties;
};

export enum EActivityFeed {
	PENDING = 'pending',
	ALL = 'all',
	GENERAL_PROPOSALS = 'general-proposals',
	RANK_REQUESTS = 'rank-requests'
}

export type ErrorBoundaryPageProps = { error: Error; reset: () => void };

export type ServerComponentProps<T, U> = {
	params?: T;
	searchParams?: U;
};

export enum ProposalStatus {
	PASSING = 'passing',
	ACTIVE = 'active'
}

export enum ActivityType {
	GENERAL_PROPOSAL = 'general-proposal',
	RANK_REQUEST = 'rank-request',
	FELLOWSHIP_RULE = 'fellowship-rule',
	INDUCTION = 'induction'
}

export enum Reaction {
	LIKE = '👍',
	DISLIKE = '👎',
	INTERESTING = '💡',
	SUPPORT = '🎉'
}

export type PublicReactionEntry = {
	reaction: Reaction;
	username: string;
	created_at: Date;
};
