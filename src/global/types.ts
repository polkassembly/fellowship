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

export interface IFellow {
	address: string;
	rank: number;
	salary?: string;
	params: {
		activeSalary: string[];
		demotionPeriod: string;
		minPromotionPeriod: string;
		offboardTimeout: string;
		passiveSalary: string;
	};
}

export interface ApiContextType {
	api?: ApiPromise;
	apiReady: boolean;
	relayApi?: ApiPromise;
	relayApiReady: boolean;
	peopleApi?: ApiPromise;
	peopleApiReady: boolean;
	network: Network;
	setNetwork: Dispatch<SetStateAction<Network>>;
	fellows: IFellow[];
	wsProvider: string;
	setWsProvider: Dispatch<SetStateAction<string>>;
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
	relayRpcEndpoints: TRPCEndpoint[];
	peopleRpcEndpoints: TRPCEndpoint[];
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
	RANK_REQUESTS = 'rank-requests',
	RFC_PROPOSALS = 'rfc-proposals'
}

export enum EProfileProposals {
	GENERAL_PROPOSALS = 'general-proposals',
	RANK_REQUESTS = 'rank-requests',
	SALARY_REQUESTS = 'salary-requests'
}

export enum EUserActivityType {
	ALL = 'all',
	VOTES = 'votes',
	REFERENDUMS = 'referendums'
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
	INDUCTION = 'induction',
	RFC_PULL_REQUEST = 'rfc-pull-request',
	RECORDING = 'recording'
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
	id: number | string;
};

export type PostView = {
	id: string;
	views_count: number;
	user_id: number;
	created_at: Date;
	updated_at?: Date;
	username?: string;
};

export type PostIdWithViews = {
	postId: string | number;
	views: PostView[];
};

export type PostIdWithReactions = {
	postId: string | number;
	reactions: PublicReactionEntry[];
};

export type Vote = {
	decision: 'yes' | 'no';
	type: 'Fellowship';
	voter: string;
	timestamp: string;
	proposalIndex: number;
	blockNumber: number;
	balance: {
		value: string;
	};
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
	TALISMAN = 'talisman',
	SUBWALLET = 'subwallet-js',
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

export enum CHANNEL {
	TELEGRAM = 'telegram',
	DISCORD = 'discord',
	ELEMENT = 'element',
	GITHUB = 'github',
	EMAIL = 'email'
}

export interface INetworkPreferences {
	channelPreferences: {
		[index: string]: {
			verification_token?: string;
			verification_token_expires?: Date;
			enabled?: boolean;
			handle?: string;
			verified?: boolean;
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

export interface IAddProfileResponse {
	message?: string;
	token?: string;
}

export interface TokenType {
	token: string;
}

export enum ProposalType {
	FELLOWSHIP_REFERENDUMS = 'fellowship_referendums',
	DISCUSSIONS = 'discussions'
}

export enum SubsquidActivityType {
	RetentionRequest = 'RetentionRequest',
	PromotionRequest = 'PromotionRequest',
	DemotionRequest = 'DemotionRequest',
	InductionRequest = 'InductionRequest',
	Promoted = 'Promoted',
	Retained = 'Retained',
	Demoted = 'Demoted',
	GeneralProposal = 'GeneralProposal',
	Inducted = 'Inducted',
	Registration = 'Registration',
	Payout = 'Payout',
	SalaryInduction = 'SalaryInduction',
	CycleStarted = 'CycleStarted',
	OffBoarded = 'OffBoarded',
	ActivityChanged = 'ActivityChanged',
	RFC = 'RFC',
	EvidenceSubmitted = 'EvidenceSubmitted',
	Voted = 'Voted',
	Imported = 'Imported',
	EvidenceJudged = 'EvidenceJudged'
}

export enum SubsquidProposalType {
	FELLOWSHIP_REFERENDUMS = 'FellowshipReferendum'
}

export interface SingleStatus {
	block: number;
	id: string;
	status: ProposalStatus;
	timestamp: string;
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
	total_votes?: {
		yes: number;
		no: number;
	};
	preimage?: {
		createdAt: string;
		createdAtBlock: number;
		deposit: string;
		hash: string;
		length: number;
		method: string;
		proposer: string;
		section: string;
		proposedCall: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			args: any;
			description: string;
			method: string;
			section: string;
		};
		status: string;
	};
	statusHistory?: SingleStatus[];
	activity_type: SubsquidActivityType;
	proposal_arguments?: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		args: any;
		description: string;
		method: string;
		section: string;
	};
	deciding?: {
		confirming: number;
		since: number;
	} | null;
	decision_deposit?: {
		amount: number;
		who: string;
	} | null;
	submission_deposit?: {
		amount: number;
		who: string;
	} | null;
	deposit?: number;
}

export interface PostFeedListingItem {
	id: number;
	user_id: number | null;
	title: string;
	content: string;
	created_at: Date;
	updated_at: Date;
	tags: string[];
	on_chain_info?: OnChainPostInfo;
	proposer_address?: string;
	username?: string;
	proposalType: ProposalType;
	comments_count: number;
	reactions_count: number; // TODO: remove this
	latest_reaction: PublicReactionEntry | null; // TODO: remove this use from reactions instead
	shares_count: number; // TODO: remove
	views_count?: number; // TODO: remove
	reactions?: PublicReactionEntry[];
	views?: PostView[];
}

export interface UserActivityListingItem {
	id: string | number;
	who: string | null;
	activityType: SubsquidActivityType;
	createdAt?: string;
	createdAtBlock?: number;
	payout: {
		amount: number;
		beneficiary: string;
		createdAt: string;
		createdAtBlock: number;
		who: string | null;
		rank: number | null;
	} | null;
	otherActions: {
		wish: string | null;
		who: string;
		showClaimButton: boolean | null;
		toRank: number | null;
		rank: number | null;
		evidenceJudged: boolean | null;
		evidence: string | null;
		createdAtBlock: number;
		createdAt: string;
		amount: number | null;
		isActive: boolean | null;
	} | null;
	vote: {
		blockNumber: number;
		decision: string;
		proposalIndex: number;
		timestamp: string;
		type: string;
		voter: string;
	} | null;
	proposal: {
		index?: number;
		proposer?: string;
		createdAt?: string;
		createdAtBlock?: number;
		title?: string;
		content?: string;
	} | null;
	salaryCycle: {
		cycleIndex: number;
	} | null;
}

export interface PayoutListingItem {
	id: number;
	amount: string;
	beneficiary: string;
	createdAt: string;
	createdAtBlock: string;
	extrinsicIndex: string;
	who: string;
	type: string;
	cycleIndex: {
		budget: string;
		cycleIndex: string;
		cycleStart: string;
		cycleStartDatetime: string;
		extrinsicIndex: string;
		id: string;
		totalRegistrations: string;
		totalUnregisteredPaid: string;
	};
	rank: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	otherActions: any;
	salaryCycle?: {
		cycleIndex: number;
	};
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

	reactions?: PublicReactionEntry[];
	views?: PostView[];
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

export interface IPreimageStatusHistory {
	extrinsicIndex: number;
	status: string;
	preimage: {
		hash: string;
	};
}

export interface IPreimageResponse {
	hash: string;
	id: string;
	length: number;
	method: string;
	section: string;
	deposit: string;
	proposedCall: {
		args: string;
		description: string;
		method: string;
		section: string;
	};
	createdAt: string;
	createdAtBlock: number;
	updatedAt: string;
	updatedAtBlock: number;
	proposer: string;
	status: string;
	statusHistory: IPreimageStatusHistory;
}

export interface IPreimagesListingResponse {
	count: number;
	preimages: IPreimageResponse[];
}

export interface IAddPostCommentResponse {
	id: string;
}

export interface IFellowDataResponse {
	[index: string]: {
		proposalsVotedOn: number;
		proposalsCreated: number;
	};
}

export enum ESocialType {
	EMAIL = 'Email',
	RIOT = 'Riot',
	TWITTER = 'Twitter',
	TELEGRAM = 'Telegram',
	DISCORD = 'Discord',
	GITHUB = 'Github'
}

export interface ISocial {
	type: ESocialType;
	link: string;
}

export interface IProfile {
	user_id: number;
	manifesto: string;
	address: string;
	activities: UserActivityListingItem[];
	social_links?: ISocial[];
}

// TODO: make a base interface for BaseFeedItem and extend it

export interface ActivityFeedItem {
	id: string;
	type: SubsquidActivityType;
	created_at: Date;
	who: string;
	comments_count?: number;
	views?: PostView[];
	reactions?: PublicReactionEntry[];
	postListingItem?: PostFeedListingItem;
	isActive?: boolean;
	cycleStartDatetime?: Date;
	evidence?: string;
	rank?: number;
	vote?: {
		decision: 'aye' | 'nay';
		proposalIndex: number;
		balance: string;
	};
}

export interface RFCPullRequestItem {
	id: number;
	title: string;
	url: string;
	created_at: Date;
	username: string;
	cursor: string;
}

export type PjsCalendarItemDuration = {
	startDate?: Date;
	endDate?: Date;
	startBlockNumber?: number;
	endBlockNumber?: number;
	duration?: number;
};

export type PjsCalendarItem = PjsCalendarItemDuration & {
	network: string;
	type: string;
	data: { [key: string]: unknown };
};

export interface TrendingProposalItem {
	id: number;
	title: string;
	status: ProposalStatus;
	created_at: Date;
	updated_at: Date;
	total_votes_count: number;
	proposer_address?: string;
	proposalType: ProposalType;
	isPassing: boolean;
}

export enum EMentionType {
	COMMENT = 'comment',
	REPLY = 'reply',
	POST = 'post'
}

export interface ITriggerPreferences {
	enabled: boolean;
	name: string;
	post_types?: Array<string>;
	tracks?: Array<number>;
	sub_triggers?: Array<string>;
	mention_types?: Array<string>;
	pip_types?: Array<string>;
}

export enum ETriggerType {
	NEW_COMMENT = 'newCommentAdded',
	NEW_MENTION = 'newMention',
	PROPOSAL_CREATED = 'proposalSubmitted',
	PROPOSAL_IN_VOTING = 'proposalInVoting',
	PROPOSAL_CLOSED = 'proposalClosed',
	DAILY_UPDATES = 'dailyUpdates'
}

export interface IPostListingItem {
	comments_count: number;
	content: string;
	created_at: Date;
	id: number;
	post_reactions: {
		[key: string]: number;
	};
	proposer: string;
	status?: ProposalStatus;
	title: string;
	type: ProposalType;
	user_id: number | null;
	updated_at: Date;
	hash?: string;
	trackNumber?: number;
}

export interface IPostListingResponse {
	totalCount: number;
	posts: IPostListingItem[];
}

export interface IEvent {
	content: string;
	end_time: Date;
	id: string;
	location: string;
	start_time: Date;
	status: string;
	title: string;
	url: string;
	participants: {
		id: string;
		avatar: string;
		name: string;
		status: 'accepted' | 'pending' | 'rejected';
	}[];
}

export interface IRecording {
	id: string;
	title: string;
	description: string;
	url: string;
	thumbnail: string;
	views_count?: number;
	created_at: Date;
	updated_at: Date;
	reactions_count?: number;
	who: string;
}

export interface IRecordingListingResponse {
	totalCount: number;
	recordings: IRecording[];
}
