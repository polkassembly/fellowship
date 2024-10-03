// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';
import { Pagination } from '@nextui-org/pagination';
import { usePathname, useRouter } from 'next/navigation';

type IPaginationProps = {
	totalCount: number;
	page: number;
};

export default function PreimagePagination({ totalCount, page }: IPaginationProps) {
	const router = useRouter();
	const pathname = usePathname();

	const handlePageClick = (currentPage: number) => {
		router.replace(`${pathname}?page=${currentPage}`);
	};
	return (
		<Pagination
			total={totalCount}
			initialPage={Number(page)}
			page={Number(page)}
			showControls
			onChange={handlePageClick}
		/>
	);
}
