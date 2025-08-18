// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState, useEffect } from 'react';
import { usePostDataContext } from '@/contexts';
import { IVoteCurve } from '@/global/types';
import VoteCurvesData from './VoteCurvesData';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import { useApiContext } from '@/contexts';

function VoteCurvesDataWrapper() {
	const [thresholdValues, setThresholdValues] = useState<{ approvalThreshold: number; supportThreshold: number } | undefined>(undefined);
	const [voteCurveData, setVoteCurveData] = useState<IVoteCurve[]>([]);
	const [isFetching, setIsFetching] = useState(false);
	const [latestApproval, setLatestApproval] = useState<number | null>(null);
	const [latestSupport, setLatestSupport] = useState<number | null>(null);

	const { postData } = usePostDataContext();
	const { network } = useApiContext();

	const timeline = postData?.on_chain_info?.statusHistory;

	// Get the block when the proposal started deciding from timeline
	const getDecidingBlock = () => {
		if (!timeline || timeline.length === 0) return 0;

		const decidingStatus = timeline.find((status) => status.status === 'Deciding');
		return decidingStatus?.block || 0;
	};

	// Fetch vote curves data
	const fetchVoteCurves = async () => {
		if (!postData.id) return;

		setIsFetching(true);
		try {
			const blockGte = getDecidingBlock();

			const { data, error } = await nextApiClientFetch<IVoteCurve[]>({
				url: 'api/v1/curves',
				data: {
					blockGte,
					postId: postData.id
				},
				network,
				isPolkassemblyAPI: false
			});

			if (error || !data) {
				console.error('Failed to fetch vote curves:', error);
				setVoteCurveData([]);
				return;
			}

			setVoteCurveData(data);

			// Get latest approval and support values
			if (data.length > 0) {
				const latest = data[data.length - 1];
				setLatestApproval(latest.approvalPercent);
				setLatestSupport(latest.supportPercent);
			}
		} catch (error) {
			console.error('Error fetching vote curves:', error);
			setVoteCurveData([]);
		} finally {
			setIsFetching(false);
		}
	};

	useEffect(() => {
		fetchVoteCurves();
	}, [postData.id, timeline]);

	// Only render if we have vote curve data
	if (voteCurveData.length === 0 && !isFetching) {
		return null;
	}

	return (
		<VoteCurvesData
			latestApproval={latestApproval}
			latestSupport={latestSupport}
			isFetching={isFetching}
			voteCurveData={voteCurveData}
			createdAt={postData.created_at}
			trackName={postData.proposalType}
			timeline={timeline}
			setThresholdValues={setThresholdValues}
			thresholdValues={thresholdValues}
		/>
	);
}

export default VoteCurvesDataWrapper;
