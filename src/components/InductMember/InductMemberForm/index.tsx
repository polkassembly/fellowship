// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import AddressDropdown from '@/components/Auth/AddressDropdown';
import WalletButtonsRow from '@/components/Auth/WalletButtonsRow';
import AlertCard from '@/components/Misc/AlertCard';
import PostArticleCard from '@/components/Post/PostPageContent/PostArticleCard';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import networkConstants from '@/global/networkConstants';
import { IPreimage, Wallet } from '@/global/types';
import executeTx from '@/utils/executeTx';
import getAllFellowAddresses from '@/utils/getAllFellowAddresses';
import getNetwork from '@/utils/getNetwork';
import getPreimage from '@/utils/getPreimage';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import getTxFee from '@/utils/getTxFee';
import queueNotification from '@/utils/queueNotification';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Divider } from '@nextui-org/divider';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import { BN, BN_HUNDRED, BN_ZERO, formatBalance } from '@polkadot/util';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import PreimageDetails from './PreimageDetails';

const accordionItemClassNames = (step: number, selectedKeys: Set<string>) => ({
	base: 'group-[.is-splitted]:px-0 group-[.is-splitted]:rounded-t-2xl',
	heading: `transition-all group-[.is-splitted]:px-6 data-[open=true]:bg-inductionAccordionHeaderBg data-[open=true]:rounded-tl-2xl data-[open=true]:rounded-tr-2xl data-[open=true]:rounded-bl-none data-[open=true]:rounded-br-none ${
		Number(Array.from(selectedKeys)[0]) > Number(step) && 'group-[.is-splitted]:bg-successModalHeaderBg rounded-2xl'
	}`,
	title: `${Number(Array.from(selectedKeys)[0]) > Number(step) ? 'text-white' : 'text-slate-600/70'} data-[open=true]:text-white text-base`,
	content: 'p-6'
});

function StepMarkerDiv({ step = 1, selectedKeys }: { step: number; selectedKeys: Set<string> }) {
	return (
		<div
			className={`border-primary_bordershadow-sm absolute -ml-[145px] flex max-h-[55px] min-h-[55px] w-[86px] items-center justify-center rounded-2xl border-1 ${
				selectedKeys.has(String(step)) ? 'bg-inductionAccordionHeaderBg' : Number(Array.from(selectedKeys)[0]) > Number(step) ? 'bg-successModalHeaderBg' : 'bg-white'
			}`}
		>
			Step {step}
		</div>
	);
}

function AccordionTitle({ step = 1, title, selectedKeys }: { step: number; title: string; selectedKeys: Set<string> }) {
	return (
		<div className='flex items-center'>
			<StepMarkerDiv
				step={step}
				selectedKeys={selectedKeys}
			/>
			<div>{title}</div>
		</div>
	);
}

interface Props {
	setSetsubmitBtnText: React.Dispatch<React.SetStateAction<string>>;
	setSuccessDetails: React.Dispatch<
		React.SetStateAction<{
			proposer: string;
			inductee: string;
			preimageHash: string;
			preimageLength: number;
			postId: number;
		}>
	>;
}

const InductMemberForm = forwardRef(({ setSetsubmitBtnText, setSuccessDetails }: Props, ref) => {
	const { api, apiReady } = useApiContext();
	const { loginWallet } = useUserDetailsContext();

	const [loading, setLoading] = useState(false);
	const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(['1']));
	const [fellowAddresses, setFellowAddresses] = useState<string[]>([]);
	const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(loginWallet);
	const [selectedAddress, setSelectedAddress] = useState<InjectedAccount | null>(null);
	const [preimage, setPreimage] = useState<IPreimage>();
	const [preimageGasFee, setPreimageGasFee] = useState(BN_ZERO);
	const [proposalGasFee, setProposalGasFee] = useState(BN_ZERO);

	const network = getNetwork();
	const networkProps = networkConstants[String(network)];
	const baseDeposit = new BN(`${networkConstants[String(network)]?.preImageBaseDeposit}` || 0);

	const formatBalanceOptions = { withUnit: false, withSi: false, forceUnit: networkProps.tokenSymbol };

	formatBalance.setDefaults({
		decimals: networkProps.tokenDecimals,
		unit: networkProps.tokenSymbol
	});

	const handleSelectionChange = (keys: Set<string>) => {
		if (Number(Array.from(keys)[0]) === 1) {
			setSetsubmitBtnText('Next Step');
		} else if (Number(Array.from(keys)[0]) === 2) {
			if (preimage) {
				setSetsubmitBtnText('Next Step');
			} else {
				setSetsubmitBtnText('Create Preimage');
			}
		}

		setSelectedKeys(keys as Set<string>);
	};

	const handleCreatePreImage = async () => {
		if (!api || !apiReady || !selectedAddress) return;

		const tx = api.tx.fellowshipCollective.addMember(selectedAddress.address);
		const preimageLocal = getPreimage(api, tx);

		if (!preimageLocal.notePreimageTx) return;

		const onFailed = (message: string) => {
			setLoading(false);
			queueNotification({
				header: 'Create Preimage transaction Failed!',
				message,
				status: 'error'
			});
		};

		const onSuccess = () => {
			setLoading(false);
			setPreimage(preimageLocal);
			queueNotification({
				header: 'Transaction Successful!',
				message: 'Preimage created successfully.',
				status: 'success'
			});
			setSetsubmitBtnText('Next Step');
		};

		await executeTx({
			address: selectedAddress.address,
			api,
			apiReady,
			errorMessageFallback: 'Error while executing transaction. Please try again.',
			network,
			onFailed,
			onSuccess,
			tx: preimageLocal?.notePreimageTx
		});
	};

	const handleSubmitProposal = async () => {
		if (!api || !apiReady || !selectedAddress || !preimage) return;

		const proposalOrigin = { FellowshipOrigins: 'FellowshipCandidates' };

		const proposalTx = api.tx.fellowshipReferenda.submit(proposalOrigin, { Lookup: { hash: preimage.preimageHash, len: String(preimage.preimageLength) } }, { After: BN_HUNDRED });

		const onFailed = (message: string) => {
			setLoading(false);
			queueNotification({
				header: 'Create proposal transaction Failed!',
				message,
				status: 'error'
			});
		};

		const onSuccess = async () => {
			setLoading(false);
			queueNotification({
				header: 'Transaction Successful!',
				message: 'Proposal submitted successfully.',
				status: 'success'
			});

			const postId = Number(await api.query.fellowshipReferenda.referendumCount());
			setSuccessDetails({
				proposer: selectedAddress.address,
				inductee: selectedAddress.address, // TODO: change to one from postID
				preimageHash: preimage.preimageHash,
				preimageLength: preimage.preimageLength,
				postId
			});
		};

		setLoading(true);

		await executeTx({
			address: selectedAddress.address,
			api,
			apiReady,
			errorMessageFallback: 'Error while executing transaction. Please try again.',
			network,
			onFailed,
			onSuccess,
			tx: proposalTx
		});
	};

	const nextStep = async () => {
		if (loading) return;

		const currKey = Number(Array.from(selectedKeys)[0]);
		switch (currKey) {
			case 1:
				setSelectedKeys(new Set(['2']));
				setSetsubmitBtnText('Create Preimage');
				break;
			case 2:
				if (!preimage) {
					await handleCreatePreImage();
				} else {
					setSelectedKeys(new Set(['3']));
					setSetsubmitBtnText('Submit Proposal');
				}
				break;
			case 3:
				await handleSubmitProposal();
				break;
			default:
		}
	};

	useImperativeHandle(ref, () => ({
		nextStep
	}));

	useEffect(() => {
		if (!api || !apiReady) return;

		(async () => {
			setLoading(true);
			const fellows = await getAllFellowAddresses(api);
			setFellowAddresses(fellows);
			setLoading(false);
		})();
	}, [api, apiReady]);

	useEffect(() => {
		if (!api || !apiReady || !selectedAddress || !fellowAddresses.includes(getSubstrateAddress(selectedAddress.address) || '')) return;

		(async () => {
			setLoading(true);
			// TODO: change address to the one from postContext
			const preImageTxArr = [api.tx.fellowshipCollective.addMember(selectedAddress.address)];
			const txFee = await getTxFee(api, preImageTxArr, selectedAddress.address);
			setPreimageGasFee(txFee);

			if (!preimage) {
				setLoading(false);
				return;
			}

			const proposalOrigin = { FellowshipOrigins: 'FellowshipCandidates' };

			const proposalTx = api.tx.fellowshipReferenda.submit(
				proposalOrigin,
				{ Lookup: { hash: preimage.preimageHash, len: String(preimage.preimageLength) } },
				{ After: BN_HUNDRED }
			);

			const proposalTxArr = [proposalTx];
			const proposalTxFee = await getTxFee(api, proposalTxArr, selectedAddress.address);
			setProposalGasFee(proposalTxFee);

			setLoading(false);
		})();
	}, [api, apiReady, fellowAddresses, preimage, selectedAddress]);

	return (
		<div className='flex gap-8 p-6'>
			<div className='flex w-[86px] flex-col items-center justify-between gap-8 py-6'>
				<Divider
					orientation='vertical'
					className='bg-foreground/10'
				/>
			</div>

			<Accordion
				selectedKeys={selectedKeys}
				onSelectionChange={(keys) => handleSelectionChange(keys as Set<string>)}
				className='gap-8'
				variant='splitted'
			>
				<AccordionItem
					key='1'
					aria-label='View Application Request'
					classNames={accordionItemClassNames(1, selectedKeys)}
					title={
						<AccordionTitle
							step={1}
							title='View Application Request'
							selectedKeys={selectedKeys}
						/>
					}
				>
					<PostArticleCard onlyDescriptionTab />
				</AccordionItem>

				<AccordionItem
					key='2'
					aria-label='Create Preimage'
					classNames={accordionItemClassNames(2, selectedKeys)}
					isDisabled={!['2', '3'].includes(Array.from(selectedKeys)[0])}
					title={
						<AccordionTitle
							step={2}
							title='Create Preimage'
							selectedKeys={selectedKeys}
						/>
					}
				>
					<div className='flex flex-col items-center justify-center gap-3 text-center text-xs'>
						<div className='flex flex-col gap-1'>
							<h3 className='text-foreground/60'>Please select a wallet : </h3>
							<WalletButtonsRow
								disabled={loading}
								onWalletClick={(e, wallet) => setSelectedWallet(wallet)}
							/>
						</div>

						{selectedWallet && !preimage && (
							<div className='flex w-full flex-col items-center justify-center gap-6'>
								{selectedAddress?.address && !fellowAddresses.includes(getSubstrateAddress(selectedAddress.address) ?? '') && (
									<AlertCard
										className='w-full'
										type='warning'
										message='This address is not a fellow. Please select a fellow address.'
									/>
								)}

								<div className='flex w-full flex-col items-start'>
									<span className='text-sm'>
										Member Address <span className='text-rose-500'>*</span>
									</span>
									<AddressDropdown
										disabled={loading}
										wallet={selectedWallet}
										onAddressSelect={setSelectedAddress}
									/>
								</div>

								<div className='flex h-12 w-full items-center justify-between rounded-2xl border-1 border-primary_border p-3 font-normal'>
									<span>Gas Fees</span>
									<span>
										{formatBalance(preimageGasFee.toString(), formatBalanceOptions)} {networkProps.tokenSymbol}
									</span>
								</div>
							</div>
						)}

						{preimage && (
							<>
								<AlertCard
									className='mb-3 w-full'
									type='success'
									message='Preimage created successfully.'
								/>

								<PreimageDetails
									className='w-full text-left text-sm'
									preimage={preimage}
									proposerAddress={selectedAddress?.address || ''}
								/>
							</>
						)}
					</div>
				</AccordionItem>

				<AccordionItem
					key='3'
					aria-label='Submit Proposal'
					classNames={accordionItemClassNames(3, selectedKeys)}
					isDisabled={Array.from(selectedKeys)[0] !== '3'}
					title={
						<AccordionTitle
							step={3}
							title='Submit Proposal'
							selectedKeys={selectedKeys}
						/>
					}
				>
					<div className='flex flex-col gap-6 text-sm font-normal'>
						<div className='flex flex-col'>
							<div>
								Preimage Hash <span className='text-rose-500'>*</span>
							</div>
							<div className='flex w-full items-center justify-between rounded-2xl border-1 border-primary_border p-3'>{preimage?.preimageHash}</div>
						</div>

						<div className='flex flex-col'>
							<div>
								Preimage Length <span className='text-rose-500'>*</span>
							</div>
							<div className='flex w-full items-center justify-between rounded-2xl border-1 border-primary_border p-3'>{preimage?.preimageLength}</div>
						</div>

						<div className='flex flex-col rounded-2xl border-1 border-primary_border p-3'>
							<div className='flex items-center justify-between'>
								<span>Total Amount Required to Submit Proposal</span>
								<span className='text-base font-semibold'>
									{formatBalance(proposalGasFee.add(baseDeposit).toString(), formatBalanceOptions)} {networkProps.tokenSymbol}
								</span>
							</div>

							<Divider className='my-3' />

							<div className='flex items-center justify-between'>
								<span>Deposit Amount</span>
								<span className='text-base font-semibold'>
									{formatBalance(baseDeposit.toString(), formatBalanceOptions)} {networkProps.tokenSymbol}
								</span>
							</div>

							<div className='flex items-center justify-between'>
								<span>Gas Fees</span>
								<span className='text-base font-semibold'>
									{formatBalance(proposalGasFee.toString(), formatBalanceOptions)} {networkProps.tokenSymbol}
								</span>
							</div>
						</div>
					</div>
				</AccordionItem>
			</Accordion>
		</div>
	);
});

export default InductMemberForm;
