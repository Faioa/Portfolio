import { error, redirect } from '@sveltejs/kit';
import parser from 'accept-language-parser';
import { loadLocales, runWithLocale } from 'wuchale/load-utils/server';

import { defaultLocale } from '$lib/lang';
import { locales } from '$lib/lang';

import * as js from './locales/js.loader.server.js';
import * as main from './locales/main.loader.server.svelte.js';

loadLocales(main.key, main.loadIDs, main.loadCatalog, locales);
loadLocales(js.key, js.loadIDs, js.loadCatalog, locales);

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	/* Getting wanted language for the request, or redirect to client's default language if not specified */
	const routeLocale = event.params.locale ?? defaultLocale;
	let locale: string | null | undefined = event.cookies.get('locale');

	// First visit
	if (!locale) {
		locale = parser.pick(locales, event.request.headers.get('accept-language') ?? '');
		if (!locale) locale = defaultLocale;
		event.cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 7, secure: true }); // maxAge = 7 days
		// throw redirect
	}

	// Not first visit + locale change
	if (routeLocale !== locale) {
		locale = routeLocale;
		event.cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 7, secure: true }); // maxAge = 7 days
	}

	if (!locales.includes(locale)) return error(404, `Unknown content`);
	return await runWithLocale(locale, () =>
		resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%lang%', locale)
		})
	);
};
