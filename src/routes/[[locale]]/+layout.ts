import { loadLocale } from 'wuchale/load-utils';

import { browser } from '$app/environment';

import { defaultLocale } from '$lib/lang';

import { locales } from '../../locales/data.js';
import '../../locales/js.loader.js';
import '../../locales/main.loader.svelte.js';

export const prerender = true;

/** @type {import('../../.svelte-kit/types/src/routes').LayoutLoad} */
export const load = async ({ params }) => {
	const locale = params.locale ?? defaultLocale;
	if (browser && locales.includes(locale)) {
		await loadLocale(locale);
	}
};
