// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import networkConstants from '@/global/networkConstants';
import { u8aToString } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';

function isHex(value: string) {
	// eslint-disable-next-line eqeqeq
	return typeof value === 'string' && value.length % 2 == 0 && /^0x[a-f\d]*$/i.test(value);
}

function containsBinaryData(str: string) {
	if (!str || typeof str !== 'string') return false;
	const buffer = Buffer.from(str.trim());
	let totalBinaryCharacters = 0;

	for (let i = 0; i < buffer.length; i += 1) {
		// eslint-disable-next-line security/detect-object-injection
		if ((buffer[i] > 0 && buffer[i] < 32) || buffer[i] > 126) {
			totalBinaryCharacters += 1;
		}
	}
	return (totalBinaryCharacters / buffer.length) * 100 > 10;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, sonarjs/cognitive-complexity
const convertAnyHexToASCII = (obj: any, network: string): any => {
	if (!obj) return obj;
	if (typeof obj === 'string') {
		if (isHex(obj)) {
			try {
				const str = u8aToString(Buffer.from(obj.replace('0x', ''), 'hex'));
				if (containsBinaryData(str)) {
					// eslint-disable-next-line security/detect-object-injection
					const ss58Format = networkConstants?.[network]?.ss58Format;
					try {
						// eslint-disable-next-line @typescript-eslint/no-shadow
						const str = encodeAddress(obj, ss58Format);
						if (str) {
							if (containsBinaryData(str)) {
								return obj;
							}
							return str;
						}
					} catch (error) {
						return obj;
					}
					return obj;
				}
				return str;
			} catch (err) {
				return obj;
			}
		} else {
			return obj;
		}
	} else if (Array.isArray(obj)) {
		return obj?.map((v) => {
			return convertAnyHexToASCII(v, network);
		});
	}
	if (typeof obj === 'object') {
		// eslint-disable-next-line no-restricted-syntax
		for (const key in obj) {
			if (key.trim().toLowerCase() !== 'id') {
				// eslint-disable-next-line security/detect-object-injection, no-param-reassign
				obj[key] = convertAnyHexToASCII(obj[key], network);
			}
		}
	}
	return obj;
};

export { containsBinaryData, isHex, convertAnyHexToASCII };
