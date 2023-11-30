// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { gql } from '@urql/core';

export const GET_FELLOWSHIP_REFERENDUMS = gql`
	query GET_FELLOWSHIP_REFERENDUMS($limit: Int = 10, $offset: Int = 0) {
		proposals(where: { type_eq: FellowshipReferendum }, limit: $limit, offset: $offset, orderBy: createdAt_DESC) {
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
	}
`;

export const GET_REFERENDUM = gql`
	query GET_REFERENDUM($index_eq: Int!, $type_eq: ProposalType = FellowshipReferendum) {
		proposals(where: { type_eq: $type_eq, index_eq: $index_eq }) {
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
