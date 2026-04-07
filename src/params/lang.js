import { locales } from '$lib/lang.js';

export function match(value) {
	return locales.includes(value);
}
