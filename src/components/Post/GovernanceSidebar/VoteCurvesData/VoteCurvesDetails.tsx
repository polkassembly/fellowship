// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

interface Props {
	latestApproval: number | null;
	latestSupport: number | null;
	thresholdValues: { approvalThreshold: number; supportThreshold: number } | undefined;
}

function VoteCurvesDetails({ latestApproval, latestSupport, thresholdValues }: Props) {
	return (
		<div className='mt-6 flex w-full gap-x-5 text-xs text-secondaryText'>
			<div className='flex w-full flex-col items-center gap-y-4'>
				<p className='flex w-full items-center justify-between'>
					<span className='flex items-center gap-x-2'>
						<span className='h-4 rotate-45 border-l-2 border-dashed border-voteAye' />
						Approval
					</span>
					<span className='font-medium text-foreground'>{latestApproval?.toFixed(2)}%</span>
				</p>
				<p className='flex w-full items-center justify-between'>
					<span className='flex items-center gap-x-2'>
						<span className='h-4 rotate-45 border-l-2 border-voteAye' />
						Threshold
					</span>
					<span className='font-medium text-foreground'>{thresholdValues ? `${thresholdValues.approvalThreshold.toFixed(2)}%` : 'N/A'}</span>
				</p>
			</div>
			<div className='flex w-full flex-col items-center gap-y-4'>
				<p className='flex w-full items-center justify-between'>
					<span className='flex items-center gap-x-2'>
						<span className='h-4 rotate-45 border-l-2 border-dashed border-voteNay' />
						Support
					</span>
					<span className='font-medium text-foreground'>{latestSupport?.toFixed(2)}%</span>
				</p>
				<p className='flex w-full items-center justify-between'>
					<span className='flex items-center gap-x-2'>
						<span className='h-4 rotate-45 border-l-2 border-voteNay' />
						Threshold
					</span>
					<span className='font-medium text-foreground'>{thresholdValues ? `${thresholdValues.supportThreshold.toFixed(2)}%` : 'N/A'}</span>
				</p>
			</div>
		</div>
	);
}

export default VoteCurvesDetails;
