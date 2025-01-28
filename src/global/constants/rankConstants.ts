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
		promotionTrack: 'PromoteTo1Dan',
		colors: {
			bg: '#F1F2FF',
			text: '#707EFF'
		}
	},
	{
		rank: 1,
		name: RANK.MEMBERS,
		displayName: 'Member',
		icon: memberIcon,
		group: RANK_GROUP.MEMBERS,
		retentionTrack: 'RetainAt1Dan',
		promotionTrack: 'PromoteTo2Dan',
		colors: {
			bg: '#F1F2FF',
			text: '#707EFF'
		}
	},
	{
		rank: 2,
		name: RANK.PROFICIENTS,
		displayName: 'Proficient',
		icon: memberIcon,
		group: RANK_GROUP.MEMBERS,
		retentionTrack: 'RetainAt2Dan',
		promotionTrack: 'PromoteTo3Dan',
		colors: {
			bg: '#F5EBFE',
			text: '#5824D4'
		}
	},
	{
		rank: 3,
		name: RANK.FELLOWS,
		displayName: 'Fellow',
		icon: fellowIcon,
		group: RANK_GROUP.FELLOWS,
		retentionTrack: 'RetainAt3Dan',
		promotionTrack: 'PromoteTo4Dan',
		colors: {
			bg: '#E6F5F4',
			text: '#1A6C8A'
		}
	},
	{
		rank: 4,
		name: RANK.ARCHITECTS,
		displayName: 'Architect',
		icon: architectIcon,
		group: RANK_GROUP.ARCHITECTS,
		retentionTrack: 'RetainAt4Dan',
		promotionTrack: 'PromoteTo5Dan',
		colors: {
			bg: '#F7F0E4',
			text: '#CE7100'
		}
	},
	{
		rank: 5,
		name: RANK.ARCHITECTS_ADEPT,
		displayName: 'Architect Adept',
		icon: architectIcon,
		group: RANK_GROUP.ARCHITECTS,
		retentionTrack: 'RetainAt5Dan',
		promotionTrack: 'PromoteTo6Dan',
		colors: {
			bg: '#FFF5E2',
			text: '#DAAC06'
		}
	},
	{
		rank: 6,
		name: RANK.GRAND_ARCHITECTS,
		displayName: 'Grand Architect',
		icon: architectIcon,
		group: RANK_GROUP.ARCHITECTS,
		retentionTrack: 'RetainAt6Dan',
		promotionTrack: 'Masters',
		colors: {
			bg: '#FFF2F1',
			text: '#EF281A'
		}
	},
	{
		rank: 7,
		name: RANK.MASTERS,
		displayName: 'Master',
		icon: masterIcon,
		group: RANK_GROUP.MASTERS,
		retentionTrack: 'Masters',
		promotionTrack: 'Masters',
		colors: {
			bg: '#FFF1F6',
			text: '#BD0126'
		}
	},
	{
		rank: 8,
		name: RANK.MASTERS_CONSTANT,
		displayName: 'Master Constant',
		icon: masterIcon,
		group: RANK_GROUP.MASTERS,
		retentionTrack: 'Masters',
		promotionTrack: 'Masters',
		colors: {
			bg: '#E2F0D8',
			text: '#3E7532'
		}
	},
	{
		rank: 9,
		name: RANK.GRAND_MASTERS,
		displayName: 'Grand Master',
		icon: masterIcon,
		group: RANK_GROUP.MASTERS,
		retentionTrack: 'Masters',
		promotionTrack: 'Masters',
		colors: {
			bg: '#C3F56B33',
			text: '#07A61E'
		}
	}
];

export default RANK_CONSTANTS;
