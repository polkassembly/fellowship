// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { BN } from '@polkadot/util';
import { HexString } from '@polkadot/util/types';
import { Dispatch, SetStateAction } from 'react';

export type TRPCEndpoint = {
	key: string;
	label: string;
};

export enum Network {
	COLLECTIVES = 'collectives',
	WESTEND_COLLECTIVES = 'westend-collectives'
}

export interface ApiContextType {
	api?: ApiPromise;
	apiReady: boolean;
	isApiLoading: boolean;
	wsProvider: string;
	setWsProvider: Dispatch<SetStateAction<string>>;
	network: Network;
	setNetwork: Dispatch<SetStateAction<Network>>;
	fellowAddresses: string[];
}

export type NetworkProperties = {
	key: Network;
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
	preImageBaseDeposit?: string;
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
	Noted = 'Noted',
	Proposed = 'Proposed',
	Tabled = 'Tabled',
	Started = 'Started',
	Announced = 'Announced',
	Passed = 'Passed',
	NotPassed = 'NotPassed',
	Cancelled = 'Cancelled',
	Executed = 'Executed',
	ExecutionFailed = 'ExecutionFailed',
	Used = 'Used',
	Invalid = 'Invalid',
	Missing = 'Missing',
	Reaped = 'Reaped',
	Approved = 'Approved',
	Disapproved = 'Disapproved',
	Closed = 'Closed',
	Awarded = 'Awarded',
	Added = 'Added',
	Rejected = 'Rejected',
	Retracted = 'Retracted',
	Slashed = 'Slashed',
	Active = 'Active',
	Removed = 'Removed',
	Extended = 'Extended',
	Claimed = 'Claimed',
	Unrequested = 'Unrequested',
	Requested = 'Requested',
	Submitted = 'Submitted',
	Killed = 'Killed',
	Cleared = 'Cleared',
	Deciding = 'Deciding',
	ConfirmStarted = 'ConfirmStarted',
	ConfirmAborted = 'ConfirmAborted',
	Confirmed = 'Confirmed',
	DecisionDepositPlaced = 'DecisionDepositPlaced',
	TimedOut = 'TimedOut',
	Opened = 'Opened'
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
	username?: string;
	created_at: Date;
	updated_at?: Date;
	user_id: number;
	id: number;
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
	loginWallet: Wallet | null;
	delegationDashboardAddress: string;
	loginAddress: string;
	multisigAssociatedAddress?: string;
	networkPreferences: INetworkPreferences;
	primaryNetwork: string;
	is2FAEnabled?: boolean;
}

export interface IAuthResponse {
	token?: string;
	user_id?: number;
	isTFAEnabled?: boolean;
	tfa_token?: string;
}

export interface MessageType {
	message: string;
}

export interface ChallengeMessage extends MessageType {
	signMessage: string;
}

export interface TokenType {
	token: string;
}

export enum ProposalType {
	FELLOWSHIP_REFERENDUMS = 'fellowship_referendums',
	DISCUSSIONS = 'discussions'
}

export enum SubsquidProposalType {
	FELLOWSHIP_REFERENDUMS = 'FellowshipReferendum'
}

export interface OnChainPostInfo {
	proposer: string;
	status: ProposalStatus;
	track_number: number;
	description: string;
	tally: {
		ayes: string;
		nays: string;
	};
	created_at?: Date;
	updated_at?: Date;
}

export interface PostListingItem {
	id: number;
	user_id: number | null;
	title: string;
	content: string;
	created_at: Date;
	updated_at: Date;
	tags: string[];
	on_chain_info?: OnChainPostInfo;
	proposalType: ProposalType;
	comments_count: number;
	reactions_count: number;
	latest_reaction: PublicReactionEntry | null;
	shares_count: number;
}

export interface CreatePostResponseType extends MessageType {
	post_id?: number;
}

export interface ChangeResponseType extends MessageType, TokenType {}

export enum EGovType {
	OPEN_GOV = 'open_gov',
	GOV1 = 'gov1'
}

export interface IPost {
	id: number | string;
	user_id: number | null;
	title: string;
	content: string;
	created_at: Date;
	updated_at: Date;
	tags: string[];
	on_chain_info?: OnChainPostInfo;
	proposalType: ProposalType;
	reactions_count: number;
	shares_count: number;
	views_count: number;
	inductee_address?: string;
}

export interface ICommentHistory {
	content: string;
	created_at: Date;
	sentiment: number | 0;
}

export interface PostComment {
	user_id: number;
	content: string;
	created_at: Date;
	history: ICommentHistory[];
	id: string;
	isDeleted: boolean;
	updated_at: Date;
	sentiment: number | 0;
	username: string;
	user_profile_img: string;
}

export interface CommentReply {
	user_id: number;
	content: string;
	created_at: Date;
	id: string;
	isDeleted: boolean;
	updated_at: Date;
	username: string;
	user_profile_img: string;
}

export interface PostCommentResponse extends PostComment {
	replies: CommentReply[];
	reactions: PublicReactionEntry[];
}

export interface IEditPostResponse {
	content: string;
	proposer: string;
	summary: string;
	title: string;
	topic: {
		id: number;
		name: string;
	};
	last_edited_at: Date;
}

export enum VoteDecisionType {
	AYE = 'aye',
	NAY = 'nay'
	// ABSTAIN = 'abstain',
	// SPLIT = 'split'
}

export interface IPreimage {
	encodedProposal: HexString | null;
	notePreimageTx: SubmittableExtrinsic<'promise'> | null;
	preimageHash: string;
	preimageLength: number;
	storageFee: BN;
}

export interface IAddPostCommentResponse {
	id: string;
}
