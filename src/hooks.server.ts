import { error, redirect } from '@sveltejs/kit';
import parser from 'accept-language-parser';
import { loadLocales, runWithLocale } from 'wuchale/load-utils/server';

import { building } from '$app/environment';

import { defaultLocale, getUrl } from '$lib/lang';
import { locales } from '$lib/lang';

import * as js from './locales/js.loader.server.js';
import * as main from './locales/main.loader.server.svelte.js';

loadLocales(main.key, main.loadIDs, main.loadCatalog, locales);
loadLocales(js.key, js.loadIDs, js.loadCatalog, locales);

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	/* Getting wanted language for the request, or redirect to client's default language if not specified */
	const isLocale = event.params.locale === null || locales.includes(event.params.locale);
	const routeLocale = isLocale ? (event.params.locale ?? defaultLocale) : defaultLocale;

	let locale: string | null | undefined = event.cookies.get('locale');

	// Is first visit AND no locale specified AND not building (prerendering)
	if (!locale && (event.params.locale === null || !isLocale) && !building) {
		locale = parser.pick(locales, event.request.headers.get('accept-language') ?? '') ?? defaultLocale;
		event.cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 7, secure: true }); // maxAge = 7 days

		// In this if block, it is certain that the routeLocale is the default one. Redirect the client if the chosen locale is not the default one.
		if (locale !== defaultLocale) {
			const newRoute = getUrl(event.url.pathname, false, {
				params: { ...event.params, locale },
				search: event.url.search,
				hash: event.url.hash
			});
			redirect(307, `${newRoute}`);
		}
	} else {
		locale = isLocale ? routeLocale : defaultLocale;
		event.cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 7, secure: true }); // maxAge = 7 days
	}

	return await runWithLocale(locale, () =>
		resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%lang%', locale)
		})
	);
};
