// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { nextui } from '@nextui-org/theme/plugin';
import type { Config } from 'tailwindcss';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createThemes } from 'tw-colors';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
	],
	darkMode: 'class',
	plugins: [
		nextui({
			prefix: 'nui',
			defaultTheme: 'light',
			defaultExtendTheme: 'light',
			themes: {
				light: {
					colors: {
						background: '#F8FAFC', // the page background color
						foreground: '#243A57', // the page text color
						primary: {
							foreground: '#FFFFFF',
							DEFAULT: '#E5007A'
						},
						secondary: {
							foreground: '#FFFFFF',
							DEFAULT: '#151532'
						}
					}
				},
				dark: {
					colors: {
						background: '#151532', // the page background color
						foreground: '#FFFFFF', // the page text color
						primary: {
							foreground: '#FFFFFF',
							DEFAULT: '#C30068'
						},
						secondary: {
							foreground: '#FFFFFF',
							DEFAULT: '#2D2D6C'
						}
					}
				}
			}
		}),
		createThemes({
			light: {
				primary_border: '#D2D8E0',
				tooltip_background: '#363636',
				tooltip_foreground: '#FFFFFF',
				link: '#1B61FF'
			},
			dark: {
				primary_border: '#3C3C8F',
				tooltip_background: '#363636',
				tooltip_foreground: '#FFFFFF',
				link: '#1B61FF'
			}
		})
	]
};
export default config;
