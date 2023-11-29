// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const POLKASSEMBLY_API_URL = process.env.NEXT_PUBLIC_APP_ENV !== 'production' ? 'https://api.polkassembly.io' : 'https://test.polkassembly.io';

export default POLKASSEMBLY_API_URL;
