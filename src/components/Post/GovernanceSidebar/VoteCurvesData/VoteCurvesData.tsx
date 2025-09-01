// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProposalType, IStatusHistoryItem, IVoteCurve } from '@/global/types';
import VoteCurves from './VoteCurves';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import VoteCurvesDetails from './VoteCurvesDetails';
import { Card } from '@nextui-org/card';

interface Props {
	trackName: ProposalType;
	createdAt?: Date;
	timeline?: IStatusHistoryItem[];
	setThresholdValues?: (values: { approvalThreshold: number; supportThreshold: number }) => void;
	thresholdValues?: { approvalThreshold: number; supportThreshold: number } | undefined;
	latestApproval: number | null;
	latestSupport: number | null;
	isFetching: boolean;
	voteCurveData: IVoteCurve[];
}

// main component
function VoteCurvesData({ trackName, createdAt, timeline, setThresholdValues, thresholdValues, latestApproval, latestSupport, isFetching, voteCurveData }: Props) {
	return (
		<Card
			className='flex flex-col gap-6 border border-primary_border bg-cardBg px-4 py-6'
			shadow='none'
			radius='lg'
		>
			<h3 className='text-lg font-semibold'>Vote Curves</h3>

			<div className='relative'>
				{isFetching && (
					<div className='absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-gray-900/80'>
						<LoadingSpinner size='sm' />
					</div>
				)}
				<VoteCurves
					voteCurveData={voteCurveData || []}
					trackName={trackName}
					timeline={timeline}
					createdAt={createdAt}
					setThresholdValues={setThresholdValues}
				/>
				<VoteCurvesDetails
					latestApproval={latestApproval}
					latestSupport={latestSupport}
					thresholdValues={thresholdValues}
				/>
			</div>
		</Card>
	);
}

export default VoteCurvesData;
