// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { gql } from '@urql/core';

export const GET_ALL_ACTIVITIES = gql`
	query GET_ALL_ACTIVITIES($limit: Int = 30, $offset: Int = 0, $type_not_in: [ActivityType!]) {
		activities(limit: $limit, offset: $offset, orderBy: createdAt_DESC, where: { type_not_in: $type_not_in }) {
			id
			type
			who
			createdAt
			proposal {
				id
				description
				index
				status
				trackNumber
				proposer
				updatedAt
				createdAt
				tally {
					ayes
					nays
				}
			}
			otherActions {
				isActive
				evidence
				rank
			}
			salaryCycle {
				cycleStartDatetime
			}
			vote {
				proposalIndex
				balance {
					... on StandardVoteBalance {
						value
					}
				}
				decision
			}
		}
	}
`;

export const GER_USER_ACTIVITY = gql`
	query GET_USER_ACTIVITY($limit: Int = 10, $offset: Int = 0, $who_eq: String) {
		activities(where: { who_eq: $who_eq }, limit: $limit, offset: $offset, orderBy: createdAt_DESC) {
			id
			type
			who
			payout {
				amount
				beneficiary
				createdAt
				createdAtBlock
				who
				rank
			}
			otherActions {
				wish
				who
				showClaimButton
				toRank
				rank
				evidenceJudged
				evidence
				createdAtBlock
				createdAt
				amount
				isActive
			}
			vote {
				blockNumber
				decision
				proposalIndex
				timestamp
				type
				voter
			}
			proposal {
				index
				proposer
				createdAt
				createdAtBlock
			}
			salaryCycle {
				cycleIndex
			}
		}
	}
`;

export const GET_FELLOWSHIP_REFERENDUMS = gql`
	query GET_FELLOWSHIP_REFERENDUMS($limit: Int = 10, $offset: Int = 0, $type_in: [ActivityType!], $who_eq: String) {
		activities(where: { type_in: $type_in, who_eq: $who_eq }, limit: $limit, offset: $offset, orderBy: proposal_createdAt_DESC) {
			type
			proposal {
				id
				description
				index
				status
				trackNumber
				proposer
				updatedAt
				createdAt
				tally {
					ayes
					nays
				}
			}
			who
		}
	}
`;

export const GET_TRENDING_PROPOSALS = gql`
	query GET_TRENDING_PROPOSALS($limit: Int = 10, $offset: Int = 0, $who_eq: String, $status: [ProposalStatus!]) {
		activities(where: { who_eq: $who_eq, proposal: { status_in: $status } }, limit: $limit, offset: $offset, orderBy: proposal_createdAt_DESC) {
			type
			proposal {
				description
				index
				status
				trackNumber
				proposer
				updatedAt
				createdAt
				tally {
					ayes
					nays
				}
			}
			who
		}
	}
`;

export const GET_SALARY_PAYOUTS = gql`
	query GET_SALARY_PAYOUTS($limit: Int = 10, $offset: Int = 0, $type_in: [ActivityType!], $who_eq: String) {
		activities(where: { type_in: $type_in, who_eq: $who_eq }, limit: $limit, offset: $offset, orderBy: proposal_createdAt_DESC) {
			type
			who
			payout {
				amount
				beneficiary
				createdAt
				createdAtBlock
				id
				extrinsicIndex
				who
				cycleIndex {
					budget
					cycleIndex
					cycleStart
					cycleStartDatetime
					extrinsicIndex
					id
					totalRegistrations
					totalUnregisteredPaid
				}
				rank
			}
			otherActions {
				wish
				who
				showClaimButton
				toRank
				rank
				isActive
				id
				extrinsicIndex
				evidenceJudged
				evidence
				createdAtBlock
				createdAt
				amount
			}
			salaryCycle {
				cycleIndex
			}
		}
	}
`;

export const GET_REFERENDUM = gql`
	query GET_FELLOWSHIP_REFERENDUM($index_eq: Int!) {
		activities(where: { proposal: { index_eq: $index_eq } }, limit: 1, offset: 0, orderBy: proposal_index_DESC) {
			type
			proposal {
				id
				description
				index
				status
				trackNumber
				proposer
				updatedAt
				createdAt
				tally {
					ayes
					nays
				}
				hash
				preimage {
					createdAt
					createdAtBlock
					deposit
					extrinsicIndex
					hash
					id
					length
					method
					proposer
					section
					proposedCall {
						args
						description
						method
						section
					}
					status
					updatedAt
					updatedAtBlock
				}
				proposalArgumentHash
				proposalArguments {
					args
					description
					method
					section
				}
				statusHistory(limit: 10) {
					block
					id
					status
					timestamp
				}
				type
				submittedAtBlock
				deciding {
					confirming
					since
				}
				decisionDeposit {
					amount
					who
				}
				submissionDeposit {
					amount
					who
				}
				deposit
			}
			who
		}
	}
`;

export const GET_VOTES_COUNT = gql`
	query GET_VOTES_COUNT($index_eq: Int! = 5, $decision_eq: VoteDecision = yes) {
		votesConnection(orderBy: id_ASC, where: { proposalIndex_eq: $index_eq, decision_eq: $decision_eq }) {
			totalCount
		}
	}
`;

export const GET_VOTES = gql`
	query GET_VOTES($limit: Int = 10, $offset: Int = 0, $index_eq: Int! = 44, $type_eq: VoteType = Fellowship, $decision_eq: VoteDecision = yes) {
		votes(limit: $limit, offset: $offset, where: { type_eq: $type_eq, proposalIndex_eq: $index_eq, decision_eq: $decision_eq }) {
			balance {
				... on StandardVoteBalance {
					value
				}
				... on SplitVoteBalance {
					aye
					nay
					abstain
				}
			}
			blockNumber
			type
			voter
			timestamp
			proposalIndex
			decision
		}
	}
`;

export const GET_FELLOW_DATA = gql`
	query GET_FELLOW_DATA {
		votesConnection(where: { voter_eq: "12MrP337azmkTdfCUKe5XLnSQrbgEKqqfZ4PQC7CZTJKAWR3" }, orderBy: id_ASC) {
			totalCount
		}
	}
`;

export const GET_FELLOWSHIP_PULL_REQUESTS = gql`
	query ($limit: Int!, $cursor: String) {
		repository(owner: "polkadot-fellows", name: "RFCs") {
			pullRequests(first: $limit, after: $cursor, states: [OPEN], orderBy: { field: CREATED_AT, direction: DESC }) {
				edges {
					cursor
					node {
						number
						title
						url
						createdAt
						author {
							login
						}
					}
				}
			}
		}
	}
`;

export const GET_FELLOWSHIP_PULL_REQUEST_BY_NUMBER = gql`
	query ($prNumber: Int!) {
		repository(owner: "polkadot-fellows", name: "RFCs") {
			pullRequest(number: $prNumber) {
				number
				title
				url
				createdAt
				author {
					login
				}
			}
		}
	}
`;

// takes multiple addresses and loops through them to return one single query, get proposals created, proposols voted on
export const getFellowsData = (addresses: string[]) => {
	return gql`
		query GET_FELLOWS_DATA {
			${addresses
				.map(
					(address) => `
				votes_${address}: votesConnection(where: { voter_eq: "${address}" }, orderBy: id_ASC) {
					totalCount
				}
				proposals_${address}: proposalsConnection(where: { proposer_eq: "${address}" }, orderBy: id_ASC) {
					totalCount
				}
			`
				)
				.join('\n')}
		}
	`;
};

export const GET_POST_LISTING_DATA = gql`
	query GET_POST_LISTING_DATA($limit: Int!, $offset: Int!) {
		proposals(limit: $limit, offset: $offset, orderBy: index_DESC, where: { type_eq: FellowshipReferendum }) {
			hash
			createdAt
			updatedAt
			description
			proposer
			status
			trackNumber
			index
		}
	}
`;

export const GET_PREIMAGES = gql`
	query GET_PREIMAGES($limit: Int = 25, $offset: Int = 0, $hash_contains: String) {
		preimagesConnection(orderBy: createdAtBlock_DESC, where: { hash_contains: $hash_contains }) {
			totalCount
		}
		preimages(limit: $limit, offset: $offset, orderBy: createdAtBlock_DESC, where: { hash_contains: $hash_contains }) {
			hash
			id
			length
			method
			section
			deposit
			proposedCall {
				args
				description
				method
				section
			}
			proposer
			status
			updatedAt
			updatedAtBlock
			createdAtBlock
			createdAt
		}
	}
`;
