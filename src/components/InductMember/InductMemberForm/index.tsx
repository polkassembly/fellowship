// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import AddressDropdown from '@/components/Auth/AddressDropdown';
import WalletButtonsRow from '@/components/Auth/WalletButtonsRow';
import AlertCard from '@/components/Misc/AlertCard';
import PostArticleCard from '@/components/Post/PostPageContent/PostArticleCard';
import { useApiContext, usePostDataContext, useUserDetailsContext } from '@/contexts';
import { Wallet } from '@/global/types';
import executeTx from '@/utils/executeTx';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import queueNotification from '@/utils/queueNotification';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Divider } from '@nextui-org/divider';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

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
		}>
	>;
}

// TODO: reduce cognitive complexity
// eslint-disable-next-line sonarjs/cognitive-complexity
const InductMemberForm = forwardRef(({ setSetsubmitBtnText, setSuccessDetails }: Props, ref) => {
	const { api, apiReady, network, fellows } = useApiContext();
	const { loginWallet, id } = useUserDetailsContext();
	const {
		postData: { inductee_address: inducteeAddress = '' }
	} = usePostDataContext();

	const [loading, setLoading] = useState(false);
	const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(['1']));
	const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(loginWallet);
	const [selectedAddress, setSelectedAddress] = useState<InjectedAccount | null>(null);

	const substrateInducteeAddress = getSubstrateAddress(inducteeAddress);

	const handleSelectionChange = (keys: Set<string>) => {
		if (Number(Array.from(keys)[0]) === 1) {
			setSetsubmitBtnText('Next Step');
		} else if (Number(Array.from(keys)[0]) === 2) {
			setSetsubmitBtnText('Submit Transaction');
		}

		setSelectedKeys(keys as Set<string>);
	};

	const handleSubmit = async () => {
		if (!id || !api || !apiReady || !selectedAddress || !substrateInducteeAddress) return;

		const tx = api.tx.fellowshipCore.induct(substrateInducteeAddress);

		const onFailed = (message: string) => {
			setLoading(false);
			queueNotification({
				header: 'Induct transaction Failed!',
				message,
				status: 'error'
			});
		};

		const onSuccess = async () => {
			queueNotification({
				header: 'Transaction Successful!',
				message: 'Induct successful.',
				status: 'success'
			});

			setLoading(false);

			setSuccessDetails({
				proposer: selectedAddress.address,
				inductee: substrateInducteeAddress
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
			tx
		});
	};

	const nextStep = async () => {
		if (loading || !substrateInducteeAddress) return;

		const currKey = Number(Array.from(selectedKeys)[0]);
		switch (currKey) {
			case 1:
				setSelectedKeys(new Set(['2']));
				setSetsubmitBtnText('Submit Transaction');
				break;
			case 2:
				await handleSubmit();
				break;
			default:
		}
	};

	useImperativeHandle(ref, () => ({
		nextStep
	}));

	if (!substrateInducteeAddress) {
		return (
			<div className='flex flex-col items-center justify-center gap-6 text-center text-sm'>
				<AlertCard
					className='w-full'
					type='warning'
					message='The inductee address is not a valid substrate address. Please check the address on the post and try again.'
				/>
			</div>
		);
	}

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
					aria-label='Submit Transaction'
					classNames={accordionItemClassNames(2, selectedKeys)}
					isDisabled={Array.from(selectedKeys)[0] !== '2'}
					title={
						<AccordionTitle
							step={2}
							title='Submit Transaction'
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

						{selectedWallet && (
							<div className='flex w-full flex-col items-center justify-center gap-6'>
								{selectedAddress?.address && !fellows?.find((fellow) => fellow.address === (getSubstrateAddress(selectedAddress?.address || '') || '')) && (
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
							</div>
						)}
					</div>
				</AccordionItem>
			</Accordion>
		</div>
	);
});

export default InductMemberForm;
