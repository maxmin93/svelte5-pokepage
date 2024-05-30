const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		container: (theme) => ({
			center: true,
			padding: {
				DEFAULT: theme('spacing.4'),
				sm: theme('spacing.5'),
				lg: theme('spacing.6'),
				xl: theme('spacing.8'),
			},
			screens: {
				'2xl': '1400px',
			},
		}),
		fontFamily: {
			sans: ['"Noto Sans KR"', ...defaultTheme.fontFamily.sans],
			serif: ['"Noto Serif KR"', ...defaultTheme.fontFamily.serif],
			mono: ['D2Coding', ...defaultTheme.fontFamily.mono],
		},
		extend: {
			colors: {
				// 색상 선택 https://oklch.com/
				pokemoncard: 'oklch(var(--pokemoncard) / <alpha-value>)',
			},
		},
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		logs: false,
		themes: [
			{
				light: {
					...require('daisyui/src/theming/themes')['light'],
					neutral: 'white',
					'neutral-content': 'black',
					'--pokemoncard': '37.26% 0.037 160.28',
				},
				dark: {
					...require('daisyui/src/theming/themes')['dark'],
					neutral: 'black',
					'neutral-content': 'white',
					'--pokemoncard': '44.52% 0.131 266.16',
				},
			},
		],
	},
};
