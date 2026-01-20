import { error, redirect } from '@sveltejs/kit';
import parser from 'accept-language-parser';
import { loadLocales, runWithLocale } from 'wuchale/load-utils/server';

import { building } from '$app/environment';

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

	// First visit && locale not specified
	if (!locale && !event.params.locale && !building) {
		locale = parser.pick(locales, event.request.headers.get('accept-language') ?? '');
		if (!locale) locale = defaultLocale;
		event.cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 7, secure: true }); // maxAge = 7 days

		const newRoute = event.url.pathname.replace(`/\/${routeLocale}\/?/`, '/') + event.url.search + event.url.hash;

		if (routeLocale !== locale) {
			if (locale === defaultLocale) throw redirect(307, `${newRoute}`);
			else throw redirect(307, `/${locale}${newRoute}`);
		}
	}

	// Not first visit + locale change
	else if (routeLocale !== locale || building) {
		locale = routeLocale;
		event.cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 7, secure: true }); // maxAge = 7 days
	} else if (!locales.includes(locale)) throw error(404, `Page Not Found with locale : ${locale}`);

	return await runWithLocale(locale, () =>
		resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%lang%', locale)
		})
	);
};
