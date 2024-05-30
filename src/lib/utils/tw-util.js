import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** @type {boolean} isBrowser */
export const isBrowser = typeof document !== 'undefined';

/** @param {...(import('clsx').ClassValue)} inputs  */
export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

/**
 * @param {string} hex
 * @returns {[number, number, number]}
 */
export function hexToHsl(hex) {
	if (!hex) [0, 0, 0];

	const sanitizedHex = hex.replace('#', '');

	const red = Number.parseInt(sanitizedHex.substring(0, 2), 16);
	const green = Number.parseInt(sanitizedHex.substring(2, 4), 16);
	const blue = Number.parseInt(sanitizedHex.substring(4, 6), 16);

	const normalizedRed = red / 255;
	const normalizedGreen = green / 255;
	const normalizedBlue = blue / 255;

	const max = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
	const min = Math.min(normalizedRed, normalizedGreen, normalizedBlue);

	let hue, saturation, lightness;

	if (max === min) {
		hue = 0;
	} else if (max === normalizedRed) {
		hue = ((normalizedGreen - normalizedBlue) / (max - min)) % 6;
	} else if (max === normalizedGreen) {
		hue = (normalizedBlue - normalizedRed) / (max - min) + 2;
	} else {
		hue = (normalizedRed - normalizedGreen) / (max - min) + 4;
	}

	hue = Math.round(hue * 60);
	if (hue < 0) {
		hue += 360;
	}

	lightness = (max + min) / 2;

	if (max === min) {
		saturation = 0;
	} else if (lightness <= 0.5) {
		saturation = (max - min) / (max + min);
	} else {
		saturation = (max - min) / (2 - max - min);
	}

	saturation = Math.round(saturation * 100);
	lightness = Math.round(lightness * 100);

	return [hue, saturation, lightness];
}

/**
 * @param {string} hex
 * @returns {[number, number, number]}
 */
export function hexToRgb(hex) {
	if (!hex) [0, 0, 0];

	const sanitizedHex = hex.replace('#', '');

	const red = Number.parseInt(sanitizedHex.substring(0, 2), 16);
	const green = Number.parseInt(sanitizedHex.substring(2, 4), 16);
	const blue = Number.parseInt(sanitizedHex.substring(4, 6), 16);

	return [red, green, blue];
}

/**
 * @param { boolean } isDark
 * @param { string[] } themes (default: light/dark)
 */
export function toggleTheme(isDark, themes = ['light', 'dark']) {
	if (isBrowser) {
		const rootEl = document.querySelector('html');
		if (rootEl) {
			rootEl.dataset.theme = isDark ? themes.at(-1) : themes.at(0);
			localStorage.setItem('theme', rootEl.dataset.theme);
		}
	}
}
