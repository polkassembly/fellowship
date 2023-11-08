// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-explicit-any */
import util from 'util';

/*
 * Pretty console log
 * @param data - data to be logged
 * @returns void
 * @example
 * pretty_console(data);
 * only use in server side code
 */
export default function consolePretty(data: any) {
	// eslint-disable-next-line no-console
	console.log(util.inspect(data, false, null, true));
}
