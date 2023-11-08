// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function textEncode(data: any) {
	const encoder = new TextEncoder();
	return encoder.encode(JSON.stringify(data));
}
