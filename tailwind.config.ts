// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { nextui } from '@nextui-org/theme/plugin';
import type { Config } from 'tailwindcss';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createThemes } from 'tw-colors';
// eslint-disable-next-line import/no-extraneous-dependencies
import plugin from 'tailwindcss/plugin';
import THEME_COLORS from './src/global/themeColors';

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
			layout: {
				radius: {
					small: '8px', // rounded-small
					medium: '14px', // rounded-medium
					large: '20px' // rounded-large
				}
			},
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
						},
						warning: '#F89118'
					}
				},
				dark: {
					colors: {
						background: '#111D2B', // the page background color
						foreground: '#FFFFFF', // the page text color
						primary: {
							foreground: '#FFFFFF',
							DEFAULT: '#FF60B5'
						},
						secondary: {
							foreground: '#FFFFFF',
							DEFAULT: '#21214F'
						}
					}
				}
			}
		}),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, func-names
		plugin(function ({ addUtilities }: { addUtilities: any }) {
			addUtilities(
				{
					'.dark-icon-filter': {
						filter: 'invert(71%) grayscale(100%) sepia(0%) saturate(558%) hue-rotate(187deg) brightness(90%) contrast(88%)'
					}
				},
				['dark']
			); // Ensure it's only applied in dark mode
		}),
		createThemes(THEME_COLORS)
	]
};
export default config;
