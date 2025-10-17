// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Github, MessageSquare, FileText, Code, TrendingUp, Clock } from 'lucide-react';
import { getGithubMonthlyStats } from '@/utils/getGithubMonthlyStats';

interface Props {
	address: string;
	className?: string;
}

interface ContributionStats {
	githubCommits: {
		count: number;
		change: number;
		period: string;
	};
	forumPosts: {
		count: number;
		change: number;
		period: string;
	};
	rfcsAuthored: {
		count: number;
		pending: number;
		period: string;
	};
	codeReviews: {
		count: number;
		change: number;
		period: string;
	};
}

function RecentContributions({ address, className }: Props) {
	const [githubStats, setGithubStats] = useState<{
		totalContributionsCount: number;
		percentageDifference: string;
		isIncrease: boolean;
	} | null>(null);
	const [loading, setLoading] = useState(true);

	// Get GitHub username from fellow's social links or mock data
	const githubUsername = 'mock-user'; // In real implementation, get from fellow's social links

	useEffect(() => {
		const fetchGithubStats = async () => {
			try {
				setLoading(true);
				const stats = await getGithubMonthlyStats();
				setGithubStats(stats);
			} catch (error) {
				console.error('Error fetching GitHub stats:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchGithubStats();
	}, [githubUsername]);

	// Mock data for demonstration - in real implementation, these would come from API
	const contributionStats: ContributionStats = {
		githubCommits: {
			count: githubStats?.totalContributionsCount || 47,
			change: githubStats?.isIncrease ? 12 : -5,
			period: 'This month'
		},
		forumPosts: {
			count: 23,
			change: 8,
			period: 'This month'
		},
		rfcsAuthored: {
			count: 3,
			pending: 1,
			period: 'This quarter'
		},
		codeReviews: {
			count: 89,
			change: 15,
			period: 'This month'
		}
	};

	if (loading) {
		return (
			<div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
				{Array.from({ length: 4 }, (_, i) => (
					<Card
						key={`loading-card-${i}`}
						className='border border-primary_border bg-cardBg p-3'
					>
						<CardHeader className='pb-3'>
							<div className='h-4 w-24 animate-pulse rounded bg-gray-200'></div>
						</CardHeader>
						<CardBody>
							<div className='space-y-2'>
								<div className='h-6 w-12 animate-pulse rounded bg-gray-200'></div>
								<div className='h-3 w-16 animate-pulse rounded bg-gray-200'></div>
								<div className='h-3 w-20 animate-pulse rounded bg-gray-200'></div>
							</div>
						</CardBody>
					</Card>
				))}
			</div>
		);
	}

	return (
		<div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
			{/* GitHub Commits Card */}
			<Card className='border border-primary_border bg-cardBg p-3'>
				<CardHeader className='pb-3'>
					<h3 className='flex items-center gap-2 text-sm font-semibold text-black dark:text-white'>
						<Github className='h-4 w-4 text-primary_accent' />
						GitHub Commits
					</h3>
				</CardHeader>
				<CardBody>
					<div className='space-y-2'>
						<div className='text-2xl font-semibold text-black dark:text-white'>{contributionStats.githubCommits.count}</div>
						<div className='text-xs text-text_secondary'>{contributionStats.githubCommits.period}</div>
						<div className='flex items-center gap-1 text-xs text-green-600'>
							<TrendingUp className='h-3 w-3' />+{contributionStats.githubCommits.change} from last month
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Forum Posts Card */}
			<Card className='border border-primary_border bg-cardBg p-3'>
				<CardHeader className='pb-3'>
					<h3 className='flex items-center gap-2 text-sm font-semibold text-black dark:text-white'>
						<MessageSquare className='h-4 w-4 text-primary_accent' />
						Forum Posts
					</h3>
				</CardHeader>
				<CardBody>
					<div className='space-y-2'>
						<div className='text-2xl font-semibold text-black dark:text-white'>{contributionStats.forumPosts.count}</div>
						<div className='text-xs text-text_secondary'>{contributionStats.forumPosts.period}</div>
						<div className='flex items-center gap-1 text-xs text-green-600'>
							<TrendingUp className='h-3 w-3' />+{contributionStats.forumPosts.change} from last month
						</div>
					</div>
				</CardBody>
			</Card>

			{/* RFCs Authored Card */}
			<Card className='border border-primary_border bg-cardBg p-3'>
				<CardHeader className='pb-3'>
					<h3 className='flex items-center gap-2 text-sm font-semibold text-black dark:text-white'>
						<FileText className='h-4 w-4 text-primary_accent' />
						RFCs Authored
					</h3>
				</CardHeader>
				<CardBody>
					<div className='space-y-2'>
						<div className='text-2xl font-semibold text-black dark:text-white'>{contributionStats.rfcsAuthored.count}</div>
						<div className='text-xs text-text_secondary'>{contributionStats.rfcsAuthored.period}</div>
						<div className='flex items-center gap-1 text-xs text-blue-600'>
							<Clock className='h-3 w-3' />
							{contributionStats.rfcsAuthored.pending} pending review
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Code Reviews Card */}
			<Card className='border border-primary_border bg-cardBg p-3'>
				<CardHeader className='pb-3'>
					<h3 className='flex items-center gap-2 text-sm font-semibold text-black dark:text-white'>
						<Code className='h-4 w-4 text-primary_accent' />
						Code Reviews
					</h3>
				</CardHeader>
				<CardBody>
					<div className='space-y-2'>
						<div className='text-2xl font-semibold text-black dark:text-white'>{contributionStats.codeReviews.count}</div>
						<div className='text-xs text-text_secondary'>{contributionStats.codeReviews.period}</div>
						<div className='flex items-center gap-1 text-xs text-green-600'>
							<TrendingUp className='h-3 w-3' />+{contributionStats.codeReviews.change} from last month
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}

export default RecentContributions;
