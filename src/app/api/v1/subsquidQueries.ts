// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { gql } from '@urql/core';

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
