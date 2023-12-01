// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const memberIcon = '/icons/ranks/members.svg';
const fellowIcon = '/icons/ranks/fellows.svg';
const architectIcon = '/icons/ranks/architects.svg';
const masterIcon = '/icons/ranks/masters.svg';

export enum RANK {
	CANDIDATES = 'CANDIDATES',
	MEMBERS = 'MEMBERS',
	PROFICIENTS = 'PROFICIENTS',
	FELLOWS = 'FELLOWS',
	ARCHITECTS = 'ARCHITECTS',
	ARCHITECTS_ADEPT = 'ARCHITECTS_ADEPT',
	GRAND_ARCHITECTS = 'GRAND_ARCHITECTS',
	MASTERS = 'MASTERS',
	MASTERS_CONSTANT = 'MASTERS_CONSTANT',
	GRAND_MASTERS = 'GRAND_MASTERS'
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
		displayName: 'Candidate',
		icon: memberIcon,
		group: RANK_GROUP.MEMBERS,
		retentionTrack: 'Members',
		promotionTrack: 'PromoteTo1Dan'
	},
	{
		rank: 1,
		name: RANK.MEMBERS,
		displayName: 'Member',
		icon: memberIcon,
		group: RANK_GROUP.MEMBERS,
		retentionTrack: 'RetainAt1Dan',
		promotionTrack: 'PromoteTo2Dan'
	},
	{
		rank: 2,
		name: RANK.PROFICIENTS,
		displayName: 'Proficient',
		icon: memberIcon,
		group: RANK_GROUP.MEMBERS,
		retentionTrack: 'RetainAt2Dan',
		promotionTrack: 'PromoteTo3Dan'
	},
	{
		rank: 3,
		name: RANK.FELLOWS,
		displayName: 'Fellow',
		icon: fellowIcon,
		group: RANK_GROUP.FELLOWS,
		retentionTrack: 'RetainAt3Dan',
		promotionTrack: 'PromoteTo4Dan'
	},
	{
		rank: 4,
		name: RANK.ARCHITECTS,
		displayName: 'Architect',
		icon: architectIcon,
		group: RANK_GROUP.ARCHITECTS,
		retentionTrack: 'RetainAt4Dan',
		promotionTrack: 'PromoteTo5Dan'
	},
	{
		rank: 5,
		name: RANK.ARCHITECTS_ADEPT,
		displayName: 'Architect Adept',
		icon: architectIcon,
		group: RANK_GROUP.ARCHITECTS,
		retentionTrack: 'RetainAt5Dan',
		promotionTrack: 'PromoteTo6Dan'
	},
	{
		rank: 6,
		name: RANK.GRAND_ARCHITECTS,
		displayName: 'Grand Architect',
		icon: architectIcon,
		group: RANK_GROUP.ARCHITECTS,
		retentionTrack: 'RetainAt6Dan',
		promotionTrack: 'Masters'
	},
	{
		rank: 7,
		name: RANK.MASTERS,
		displayName: 'Master',
		icon: masterIcon,
		group: RANK_GROUP.MASTERS,
		retentionTrack: 'Masters',
		promotionTrack: 'Masters'
	},
	{
		rank: 8,
		name: RANK.MASTERS_CONSTANT,
		displayName: 'Master Constant',
		icon: masterIcon,
		group: RANK_GROUP.MASTERS,
		retentionTrack: 'Masters',
		promotionTrack: 'Masters'
	},
	{
		rank: 9,
		name: RANK.GRAND_MASTERS,
		displayName: 'Grand Master',
		icon: masterIcon,
		group: RANK_GROUP.MASTERS,
		retentionTrack: 'Masters',
		promotionTrack: 'Masters'
	}
];

export default RANK_CONSTANTS;
