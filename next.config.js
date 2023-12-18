// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/** @type {import('next').NextConfig} */
const nextConfig = {	
    async redirects() {
        return [
            {
            source: '/member-referenda',
            destination: '/referenda',
            permanent: true,
            },
        ]
    },
};

module.exports = nextConfig;
