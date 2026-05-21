import { redirect } from '@sveltejs/kit';
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
	const pathname = event.url.pathname;
	let urlHasLocale = false;

	const pathSegments = pathname.split('/');
	if (pathSegments.length > 0) urlHasLocale = locales.includes(pathSegments[1]);

	/* Getting wanted language for the request, or redirect to the client's default language if not specified */
	const routeLocale = urlHasLocale ? pathSegments[1] : defaultLocale;
	let locale = event.cookies.get('locale');

	// Is first visit AND no locale specified
	if (!locale && !urlHasLocale) {
		locale = parser.pick(locales, event.request.headers.get('accept-language') ?? '') ?? defaultLocale;

		if (!building) event.cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 7, secure: true }); // maxAge = 7 days

		// Redirect the client if the chosen locale is not the default one.
		if (locale !== defaultLocale) {
			const newRoute = getUrl(event.url.pathname, false, {
				params: { ...event.params, locale },
				search: event.url.search,
				hash: event.url.hash
			});
			redirect(307, `${newRoute}`);
		}
	} else {
		// The locale specified in the URL takes priority over the one specified in the cookie.
		// Updating the cookie if the client's locale is different from the one specified in the URL.
		if (!building && routeLocale !== locale) {
			event.cookies.set('locale', routeLocale, { path: '/', maxAge: 60 * 60 * 24 * 7, secure: true }); // maxAge = 7 days
		}
		locale = routeLocale;
	}

	return await runWithLocale(locale, () =>
		resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%lang%', locale)
		})
	);
};
