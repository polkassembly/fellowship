// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import './Markdown.scss';

interface Props {
	className?: string;
	isPreview?: boolean;
	isAutoComplete?: boolean;
	md: string;
	imgHidden?: boolean;
}

function LinkRenderer({ href = '', children = null }: { href?: string; children?: React.ReactNode }) {
	return (
		<a
			href={href}
			target='_blank'
			rel='noreferrer noopener'
		>
			{children}
		</a>
	);
}

function Markdown({ className, isPreview = false, isAutoComplete = false, md, imgHidden = false }: Props) {
	const sanitisedMd = md?.replace(/\\n/g, '\n');

	return (
		<ReactMarkdown
			className={`${className} mde-content ${isPreview && 'mde-preview-content'} ${imgHidden && 'hide-image'} ${isAutoComplete && 'mde-autocomplete-content'}`}
			rehypePlugins={[rehypeRaw, remarkGfm]}
			components={{ a: LinkRenderer }}
		>
			{sanitisedMd}
		</ReactMarkdown>
	);
}

export default Markdown;
