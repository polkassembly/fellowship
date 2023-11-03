// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { isValidNetwork } from '@/utils/isValidNetwork';
import { EActivityFeed } from '@/global/types';
import { APIError } from '@/global/exceptions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function iteratorToStream(iterator: any) {
	return new ReadableStream({
		async pull(controller) {
			const { value, done } = await iterator.next();

			if (done) {
				controller.close();
			} else {
				controller.enqueue(value);
			}
		}
	});
}

function sleep(time: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
}

const encoder = new TextEncoder();

async function* makeIterator() {
	yield encoder.encode('<p>One</p>');
	await sleep(200);
	yield encoder.encode('<p>Two</p>');
	await sleep(200);
	yield encoder.encode('<p>Three</p>');
}

export const POST = async (req: Request) => {
	try {
		const { feedType = EActivityFeed.ALL } = await req.json();
		console.log('feedType', feedType);

		const headersList = headers();
		const network = headersList.get('x-network');
		if (!network || !isValidNetwork(network)) return NextResponse.json({ error: 'Invalid network in request header.' }, { status: 400 });

		const iterator = makeIterator();
		const stream = iteratorToStream(iterator);

		if (stream) {
			throw new APIError('There is no stream ? How ?', 404, 'TEST_ERROR');
		}

		return new Response(stream);
	} catch (error) {
		const err = error as APIError;
		return NextResponse.json({ ...err, message: err.message }, { status: err.status });
	}
};
