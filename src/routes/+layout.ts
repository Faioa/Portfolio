import { loadLocale } from 'wuchale/load-utils';

import { browser } from '$app/environment';

import { defaultLocale } from '$lib/lang';

import { locales } from '../locales/data.js';
import '../locales/js.loader.js';
import '../locales/main.loader.svelte.js';

export const prerender = true;

/** @type {import('../../.svelte-kit/types/src/routes').LayoutLoad} */
export const load = async ({ url, params }) => {
	if (browser) {
		if (params.locale && locales.includes(params.locale)) {
			await loadLocale(params.locale);
			return;
		} else {
			// Additional check in case the URL is not correct (err 404)
			const pathname = url.pathname;
			if (pathname.length > 1 && pathname.startsWith('/')) {
				const tmp = pathname.split('/')[1];
				if (locales.includes(tmp)) {
					await loadLocale(tmp);
					return;
				}
			}
			await loadLocale(defaultLocale);
		}
	}
};
