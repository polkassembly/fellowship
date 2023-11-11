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
		}
	}
`;
