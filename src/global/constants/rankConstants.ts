// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const memberIcon = '/icons/ranks/members.svg';
const fellowIcon = '/icons/ranks/fellows.svg';
const architectIcon = '/icons/ranks/architects.svg';
const masterIcon = '/icons/ranks/masters.svg';

export enum RANK {
	CANDIDATES,
	MEMBERS,
	PROFICIENTS,
	FELLOWS,
	ARCHITECTS,
	ARCHITECTS_ADEPT,
	GRAND_ARCHITECTS,
	MASTERS,
	MASTERS_CONSTANT,
	GRAND_MASTERS
}

export enum RANK_GROUP {
	MASTERS = 'MASTERS',
	ARCHITECTS = 'ARCHITECTS',
	FELLOWS = 'FELLOWS',
	MEMBERS = 'MEMBERS'
}

const RANK_CONSTANTS = [
	{
		rank: 0,
		name: RANK.CANDIDATES,
		icon: memberIcon,
		group: RANK_GROUP.MEMBERS
	},
	{
		rank: 1,
		name: RANK.MEMBERS,
		icon: memberIcon,
		group: RANK_GROUP.MEMBERS
	},
	{
		rank: 2,
		name: RANK.PROFICIENTS,
		icon: memberIcon,
		group: RANK_GROUP.MEMBERS
	},
	{
		rank: 3,
		name: RANK.FELLOWS,
		icon: fellowIcon,
		group: RANK_GROUP.FELLOWS
	},
	{
		rank: 4,
		name: RANK.ARCHITECTS,
		icon: architectIcon,
		group: RANK_GROUP.ARCHITECTS
	},
	{
		rank: 5,
		name: RANK.ARCHITECTS_ADEPT,
		icon: architectIcon,
		group: RANK_GROUP.ARCHITECTS
	},
	{
		rank: 6,
		name: RANK.GRAND_ARCHITECTS,
		icon: architectIcon,
		group: RANK_GROUP.ARCHITECTS
	},
	{
		rank: 7,
		name: RANK.MASTERS,
		icon: masterIcon,
		group: RANK_GROUP.MASTERS
	},
	{
		rank: 8,
		name: RANK.MASTERS_CONSTANT,
		icon: masterIcon,
		group: RANK_GROUP.MASTERS
	},
	{
		rank: 9,
		name: RANK.GRAND_MASTERS,
		icon: masterIcon,
		group: RANK_GROUP.MASTERS
	}
];

export default RANK_CONSTANTS;
