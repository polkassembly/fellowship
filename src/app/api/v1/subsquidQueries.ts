// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { gql } from '@urql/core';

export const GET_FELLOWSHIP_REFERENDUMS = gql`
	query GET_FELLOWSHIP_REFERENDUMS($limit: Int = 10, $offset: Int = 0, $type_in: [ActivityType!]) {
		activities(where: { type_in: $type_in }, limit: $limit, offset: $offset, orderBy: proposal_createdAt_DESC) {
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
