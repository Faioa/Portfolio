import { loadLocales, runWithLocale } from 'wuchale/load-utils/server';

import { defaultLocale } from '$lib/lang';

import { locales } from './locales/data.js';
import * as js from './locales/js.loader.server.js';
import * as main from './locales/main.loader.server.svelte.js';

loadLocales(main.key, main.loadIDs, main.loadCatalog, locales);
loadLocales(js.key, js.loadIDs, js.loadCatalog, locales);

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	const locale = event.params.locale ?? defaultLocale;
	return await runWithLocale(locale, () => resolve(event));
};
