// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/** @type {import('next').NextConfig} */
const nextConfig = {
	async headers() {
		return [
			{
				source: '/api/:path*',
				headers: [
					{ key: 'Access-Control-Allow-Credentials', value: 'true' },
					{ key: 'Access-Control-Allow-Origin', value: '*' },
					{ key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
					{ key: 'Access-Control-Allow-Headers', value: '*' },
					{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
					{ key: 'Content-Security-Policy', value: "default-src 'self'; img-src '*'" },
					{ key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate=59' }
				]
			}
		];
	},
	async redirects() {
		return [
			{
				source: '/member-referenda/:slug',
				destination: '/referenda/:slug',
				permanent: true
			}
		];
	}
};

module.exports = nextConfig;
