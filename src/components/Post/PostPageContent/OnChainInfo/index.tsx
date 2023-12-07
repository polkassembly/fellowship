// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import AddressInline from '@/components/Profile/Address/AddressInline';
import { OnChainPostInfo } from '@/global/types';
import { Divider } from '@nextui-org/divider';
import { Tooltip } from '@nextui-org/tooltip';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import useCurrentBlock from '@/hooks/useCurrentBlock';
import { useApiContext } from '@/contexts';
import formattedBlockToTime from '@/utils/formattedBlockToTime';
import formatBnBalance from '@/utils/formatBnBalance';
import ArgumentsTableJSONView from './ArgumentsTableJSONView';

interface Props {
	onChainInfo?: OnChainPostInfo;
}

const getMetadataArray = (onChainInfo: OnChainPostInfo) => {
	const { preimage } = onChainInfo;

	const metadataArray: {
		value: string | undefined | number;
		label: string;
		cmp: React.JSX.Element;
	}[] = [];

	if (preimage) {
		const { length, createdAt, createdAtBlock, hash, method, proposer, section, status } = preimage;

		if (length) {
			metadataArray.push({ value: length, label: 'Length', cmp: <p>{length}</p> });
		}

		if (hash) {
			metadataArray.push({
				value: hash,
				label: 'Hash',
				cmp: (
					<Tooltip content={hash}>
						<span>{hash.slice(0, 24)}...</span>
					</Tooltip>
				)
			});
		}

		if (method) {
			metadataArray.push({ value: method, label: 'Method', cmp: <p>{method}</p> });
		}

		if (proposer) {
			metadataArray.push({
				value: proposer,
				label: 'Proposer',
				cmp: (
					<AddressInline
						address={proposer}
						endChars={5}
						startChars={5}
					/>
				)
			});
		}

		if (section) {
			metadataArray.push({ value: section, label: 'Section', cmp: <p>{section}</p> });
		}

		if (status) {
			metadataArray.push({ value: status, label: 'Status', cmp: <p>{status}</p> });
		}

		if (createdAtBlock) {
			metadataArray.push({ value: createdAtBlock, label: 'Created At Block', cmp: <p>{createdAtBlock}</p> });
		}

		if (createdAt) {
			metadataArray.push({ value: createdAt, label: 'Created At', cmp: <p>{dayjs(createdAt).format('DD MMM YYYY')}</p> });
		}
	}

	return metadataArray;
};

function OnChainInfo({ onChainInfo }: Props) {
	const currentBlock = useCurrentBlock();
	const { network } = useApiContext();

	const metadataArray = useMemo(() => {
		if (!onChainInfo)
			return [] as {
				value: string | number | undefined;
				label: string;
				cmp: React.JSX.Element;
			}[];
		const mdArray = getMetadataArray(onChainInfo);
		const { deciding, submission_deposit: submissionDeposit, decision_deposit: decisionDeposit, preimage } = onChainInfo;

		if (preimage?.deposit) {
			mdArray.push({
				value: preimage?.deposit,
				label: 'Deposit',
				cmp: <p>{formatBnBalance(String(preimage?.deposit), { numberAfterComma: 2, withUnit: true }, network)}</p>
			});
		}

		if (deciding?.since) {
			mdArray.push({ value: deciding?.since, label: 'Deciding Since', cmp: <p>{formattedBlockToTime(Number(deciding.since), network, currentBlock)}</p> });
		}

		if (deciding?.confirming) {
			mdArray.push({ value: deciding?.confirming, label: 'Confirm Started', cmp: <p>{formattedBlockToTime(Number(deciding.confirming), network, currentBlock)}</p> });
		}

		if (decisionDeposit?.amount) {
			mdArray.push({
				value: decisionDeposit?.amount,
				label: 'Decision Deposit',
				cmp: <p>{formatBnBalance(String(decisionDeposit?.amount), { numberAfterComma: 2, withUnit: true }, network)}</p>
			});
		}

		if (decisionDeposit?.who) {
			mdArray.push({
				value: decisionDeposit?.who,
				label: 'Decision Deposited By',
				cmp: (
					<AddressInline
						address={decisionDeposit?.who}
						endChars={5}
						startChars={5}
					/>
				)
			});
		}

		if (submissionDeposit?.amount) {
			mdArray.push({
				value: submissionDeposit?.amount,
				label: 'Submission Deposit',
				cmp: <p>{formatBnBalance(String(submissionDeposit?.amount), { numberAfterComma: 2, withUnit: true }, network)}</p>
			});
		}

		if (submissionDeposit?.who) {
			mdArray.push({
				value: submissionDeposit?.who,
				label: 'Submission Deposited By',
				cmp: (
					<AddressInline
						address={submissionDeposit?.who}
						endChars={5}
						startChars={5}
					/>
				)
			});
		}

		return mdArray;
	}, [onChainInfo, network, currentBlock]);

	if (!onChainInfo) return null;

	return (
		<div>
			<h5 className='mb-5 text-base font-bold'>Metadata</h5>
			<ul className='flex list-none flex-col gap-y-2'>
				{metadataArray?.map((data, idx) => {
					return (
						<>
							<li
								key={data.label}
								className='grid grid-cols-8'
							>
								<h6 className='col-span-3 text-sm'>{data.label}</h6>
								<div className='col-span-5 text-sm text-gray-500'>{data.cmp}</div>
							</li>
							{idx < metadataArray.length - 1 ? <Divider /> : null}
						</>
					);
				})}
			</ul>
			<ArgumentsTableJSONView postArguments={onChainInfo?.preimage?.proposedCall || onChainInfo?.proposal_arguments} />
		</div>
	);
}

export default OnChainInfo;
