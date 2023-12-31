// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useContext } from 'react';

import { ApiContext } from './ApiContext';
import { UserDetailsContext } from './UserDetailsContext';
import { PostDataContext } from './PostDataContext';
import { CommentsContext } from './CommentsContext';

const useApiContext = () => {
	return useContext(ApiContext);
};

const useUserDetailsContext = () => {
	return useContext(UserDetailsContext);
};

const usePostDataContext = () => {
	return useContext(PostDataContext);
};

const useCommentsContext = () => {
	return useContext(CommentsContext);
};

export { useApiContext, useUserDetailsContext, usePostDataContext, useCommentsContext };
