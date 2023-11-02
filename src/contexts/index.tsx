// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useContext } from 'react';

import { ApiContext } from './ApiContext';
import { UserDetailsContext } from './UserDetailsContext';

const useApiContext = () => {
	return useContext(ApiContext);
};

const useUserDetailsContext = () => {
	return useContext(UserDetailsContext);
};

export { useApiContext, useUserDetailsContext };
