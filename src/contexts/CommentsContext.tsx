// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { PostCommentResponse } from '@/global/types';
import { Context, createContext, Dispatch, PropsWithChildren, SetStateAction, useMemo, useState } from 'react';

export interface ICommentsContextProviderProps extends PropsWithChildren {
	initPostComments: PostCommentResponse[];
}

export interface ICommentsContext {
	postComments: PostCommentResponse[];
	setPostComments: Dispatch<SetStateAction<PostCommentResponse[]>>;
}

export const CommentsContext: Context<ICommentsContext> = createContext({} as ICommentsContext);

function CommentsContextProvider({ initPostComments, children }: ICommentsContextProviderProps) {
	const [postComments, setPostComments] = useState(initPostComments || []);

	const providerValue = useMemo(() => ({ postComments, setPostComments }), [postComments, setPostComments]);

	return <CommentsContext.Provider value={providerValue}>{children}</CommentsContext.Provider>;
}

export default CommentsContextProvider;
