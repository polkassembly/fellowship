// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Dispatch, SetStateAction } from 'react';

export type TRPCEndpoint = {
	key: string;
	label: string;
};

export enum Network {
	KUSAMA = 'kusama',
	POLKADOT = 'polkadot',
	COLLECTIVES = 'collectives'
}

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
	relayRpcEndpoints?: TRPCEndpoint[];
	name: string; // to store alphabetical case
};

export type NetworkConstants = {
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

export enum Role {
	ANONYMOUS = 'anonymous',
	ADMIN = 'admin',
	PROPOSAL_BOT = 'proposal_bot',
	USER = 'user',
	EVENT_BOT = 'event_bot',
	MODERATOR = 'moderator'
}

export interface Roles {
	allowedRoles: Role[];
	currentRole: Role.PROPOSAL_BOT | Role.USER | Role.EVENT_BOT | Role.MODERATOR;
}

export enum Wallet {
	POLKADOT = 'polkadot-js',
	OTHER = ''
}

export interface JWTPayloadType {
	default_address: string;
	addresses: string[];
	sub: string;
	username: string;
	email: string;
	email_verified: boolean;
	iat: number;
	id: number;
	roles: Roles;
	web3signup: boolean;
	is2FAEnabled?: boolean;
	login_wallet?: Wallet;
	login_address?: string;
}

export interface INetworkPreferences {
	channelPreferences: {
		[index: string]: {
			verification_token?: string;
			verification_token_expires?: Date;
			enabled?: boolean;
			handle?: string;
		};
	};
	triggerPreferences: {
		[index: string]: {
			[index: string]: {
				enabled: boolean;
				name: string;
				post_types?: Array<string>;
				tracks?: Array<number>;
				mention_types?: Array<string>;
				sub_triggers?: Array<string>;
			};
		};
	};
}

export interface UserDetailsContextType {
	id?: number | null;
	picture?: string | null;
	username?: string | null;
	email?: string | null;
	email_verified?: boolean | null;
	addresses?: string[] | null;
	allowed_roles?: string[] | null;
	defaultAddress?: string | null;
	setUserDetailsContextState: Dispatch<SetStateAction<UserDetailsContextType>>;
	web3signup?: boolean | null;
	isLoggedOut: () => boolean;
	loginWallet: Wallet | null;
	delegationDashboardAddress: string;
	loginAddress: string;
	multisigAssociatedAddress?: string;
	networkPreferences: INetworkPreferences;
	primaryNetwork: string;
	is2FAEnabled?: boolean;
}
