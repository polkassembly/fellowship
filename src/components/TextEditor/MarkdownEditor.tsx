// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-explicit-any */
import 'react-mde/lib/styles/css/react-mde-all.css';
import React, { LegacyRef, forwardRef, useCallback, useEffect, useState } from 'react';
import ReactMde, { Suggestion } from 'react-mde';
import { IMG_BB_API_KEY, ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } from '@/global/apiKeys';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import debounce from 'lodash.debounce';
import algoliasearch from 'algoliasearch/lite';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import './MarkdownEditor.scss';
import Markdown from './Markdown';

interface Props {
	className?: string;
	height?: number;
	onChange: ((value: string) => void) | undefined;
	value: string;
	disabled?: boolean;
}

const MarkdownEditor = forwardRef(function MarkdownEditor({ className, height, onChange, value, disabled }: Props, ref) {
	const { id, username } = useUserDetailsContext();
	const { network } = useApiContext();

	const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>('write');

	const algoliaClient = algoliasearch(ALGOLIA_APP_ID || '', ALGOLIA_SEARCH_API_KEY || '');

	const loadSuggestions = async (pattern: string): Promise<Suggestion[]> => {
		const queries = [
			{
				indexName: 'polkassembly_users',
				query: pattern,
				params: {
					hitsPerPage: 6,
					restrictSearchableAttributes: ['username']
				}
			},
			{
				indexName: 'polkassembly_addresses',
				query: pattern,
				params: {
					hitsPerPage: 4,
					restrictSearchableAttributes: ['address']
				}
			}
		];

		const hits = await algoliaClient.search(queries, { strategy: 'none' });

		const usernameHits = hits.results[0]?.hits || [];
		const addressHits = hits.results[1]?.hits || [];

		const usernameResults: Suggestion[] = usernameHits.map((user: any) => ({
			preview: `@${user.username}`,
			value: `[@${user.username}](${global.window.location.origin}/user/${user.username})`
		}));

		const addressResults: Suggestion[] = addressHits.map((user: any) => ({
			preview: `@${user.address}`,
			value: `[@${user.address}](${global.window.location.origin}/address/${user.address})`
		}));

		return [...usernameResults, ...addressResults];
	};

	// Generator function to save images pasted. This generator should 1) Yield the image URL. 2) Return true if the save was successful or false, otherwise
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, func-names
	const handleSaveImage = async function* (data: any) {
		const imgBlob = new Blob([data], { type: 'image/jpeg' });

		const formData = new FormData();
		formData.append('image', imgBlob, `${id}_${username}_${new Date().valueOf()}.jpg`);

		let url = '';

		await fetch(`https://api.imgbb.com/1/upload?key=${IMG_BB_API_KEY}`, {
			body: formData,
			method: 'POST'
		})
			.then((response) => response.json())
			.then((res) => {
				url = res?.data?.display_url;
			})
			// eslint-disable-next-line no-console
			.catch((error) => console.error('Error in uploading image: ', error));

		// yields the URL that should be inserted in the markdown
		yield url;

		// returns true meaning that the save was successful
		return Boolean(url);
	};

	const [input, setInput] = useState<string>(value || '');
	const [validUsers, setValidUsers] = useState<string[]>([]);
	const [replacedUsernames, setReplacedUsernames] = useState<string[]>([]);

	async function getUserData(usernameQuery: string, content: string) {
		let inputData = content;
		const res = await nextApiClientFetch({
			network,
			url: `api/v1/auth/data/userProfileWithUsername?username=${usernameQuery}`,
			isPolkassemblyAPI: true
		});
		if (res.data) {
			if (!replacedUsernames.includes(usernameQuery)) {
				// TODO: fix potential security issue
				// eslint-disable-next-line security/detect-non-literal-regexp
				const regex = new RegExp(`@${usernameQuery}(?!.*@${usernameQuery})`);

				inputData = inputData.replace(regex, `[@${usernameQuery}](${global.window.location.origin}/user/${usernameQuery})`);
				setReplacedUsernames([...replacedUsernames, usernameQuery]);
			}
			setInput(inputData);
			setValidUsers([...validUsers, usernameQuery]);
		}

		onChange?.(inputData);
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedAPIcall = useCallback(debounce(getUserData, 1000), []);

	const handleOnChange = async (content: string) => {
		const inputValue = content;
		setInput(inputValue);

		const matches = inputValue.match(/(?<!\S)@(\w+)(?!\.\w)/g);
		if (matches && matches.length > 0) {
			const usernameQuery = matches[matches.length - 1].replace('@', '');
			if (!validUsers.includes(usernameQuery)) {
				debouncedAPIcall(usernameQuery, content);
			} else if (validUsers.includes(usernameQuery)) {
				let inputData = content;
				// TODO: fix potential security issue
				// eslint-disable-next-line security/detect-non-literal-regexp
				const regex = new RegExp(`@${usernameQuery}(?!.*@${usernameQuery})`);
				inputData = inputData.replace(regex, `[@${usernameQuery}](${window.location.origin}/user/${usernameQuery})`);
				setInput(inputData);
			}
		}

		onChange?.(inputValue);

		return content;
	};

	useEffect(() => {
		setInput(value);
	}, [value]);

	return (
		<div className={`${className}`}>
			<ReactMde
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				ref={ref as LegacyRef<any>}
				readOnly={disabled}
				generateMarkdownPreview={(markdown) =>
					Promise.resolve(
						<Markdown
							isPreview
							md={markdown}
						/>
					)
				}
				minEditorHeight={height}
				minPreviewHeight={height}
				onTabChange={setSelectedTab}
				selectedTab={selectedTab}
				loadSuggestions={loadSuggestions}
				classes={{
					suggestionsDropdown: 'rounded-lg bg-cardBg [&>li]:bg-cardBg'
				}}
				toolbarCommands={[['bold', 'header', 'link', 'quote', 'strikethrough', 'code', 'image', 'ordered-list', 'unordered-list']]}
				paste={{
					saveImage: handleSaveImage
				}}
				onChange={handleOnChange}
				value={input}
			/>
		</div>
	);
});

export default MarkdownEditor;
