// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export const getColor = (count: number) => {
	if (count === 0) return 'fill-contributionEmpty';
	if (count < 5) return 'fill-contributionSm';
	if (count < 10) return 'fill-contributionMd';
	if (count < 20) return 'fill-contributionLg';
	return 'fill-contributionXl';
};
