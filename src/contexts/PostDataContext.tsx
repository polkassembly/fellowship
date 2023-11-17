// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { IPost } from '@/global/types';
import { Context, createContext, Dispatch, PropsWithChildren, SetStateAction, useMemo, useState } from 'react';

export interface IPostDataContextProviderProps extends PropsWithChildren {
	postItem: IPost;
}

export interface IPostDataContext {
	postData: IPost;
	setPostData: Dispatch<SetStateAction<IPost>>;
}

export const PostDataContext: Context<IPostDataContext> = createContext({} as IPostDataContext);

function PostDataContextProvider({ postItem, children }: IPostDataContextProviderProps) {
	const [postData, setPostData] = useState(postItem);

	const providerValue = useMemo(() => ({ postData, setPostData }), [postData, setPostData]);

	return <PostDataContext.Provider value={providerValue}>{children}</PostDataContext.Provider>;
}

export default PostDataContextProvider;
