// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export const USERNAME_RULES = { maxLength: 30, minLength: 3, pattern: /^[A-Za-z0-9._-]*$/ };
// eslint-disable-next-line security/detect-unsafe-regex
export const EMAIL_RULES = { pattern: /^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i };

export const PASSWORD_RULES = { minLength: 6 };

export const TFA_CODE_RULES = { minLength: 6, maxLength: 6, length: 6 };
