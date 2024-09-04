// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import THEME_CONSTANTS from '@/global/themeConstants';

function AppLogo() {
	const { resolvedTheme = 'light' } = useTheme();

	const [mounted, setMounted] = useState(false);

	// only mount on client to prevent hydration error and fix rendering glitch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<Image
			src={THEME_CONSTANTS[resolvedTheme as keyof typeof THEME_CONSTANTS].polk_logo}
			alt='Logo'
			width={100}
			height={20}
		/>
	);
}

export default AppLogo;
