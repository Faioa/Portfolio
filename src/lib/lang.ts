import { resolve } from '$app/paths';

export const locales = ['en', 'fr'];
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/**
 * This function determines whether the given *href* is based on a given origin.
 * @param href **String** representing the href that needs to be verified. If it does not contain an origin,
 * the function will consider it to be the same as the given one.
 * @param origin **String** representing the origin that will be compared with *href*'s.
 */
export function urlIsExternal(href: string, origin: string): boolean {
	try {
		// origin will not be used if the href contains one
		const url = new URL(href, origin);
		return url.origin !== origin;
	} catch {
		return false;
	}
}

/**
 * This function computes the correct URL based on its parameters. If the URL is external to website, there is
 * nothing to do.
 * Else, it will try to find the absolute path of the destination while using the specified locale (if it is not the
 * default one). If there is an issue with the parameters, the default return value is an empty string.
 * @param href **String** representing the destination's URL.
 * @param isExternal **Boolean** describing if the URL is external or not. Please refer to ***urlIsExternal*** helper
 * function.
 * @param opts **Object** containing the different options used in this function :
 * - *id* should be SvelteKit's corresponding route id. Its default value is an empty string. It is necessary when the
 * URL is relative;
 * - *params* should contain the different options used by **resolve** (especially *locale*);
 * - *search* should start with **?** and corresponds to the search parameters in the URL. Its default value is an
 * empty string;
 * - *hash* should start with **#** and corresponds to the anchor tag in the URL. Its default value is an empty string.
 */
export function getUrl(
	href: string,
	isExternal: boolean,
	opts: {
		id?: string | null;
		params?: Record<string, string>;
		search?: string;
		hash?: string;
	} = {}
): string {
	// If link is external, nothing to do
	if (isExternal) return href;

	let id = opts.id || '';
	const search = opts.search || '';
	const hash = opts.hash || '';
	const params = opts.params || {};
	let fullURL = '';

	// href is absolute
	if (href.startsWith('/')) {
		// Default locale is used if not specified
		const baseURL = params.locale && params.locale !== defaultLocale ? `/${params.locale}` : '';
		fullURL = baseURL.concat(href);
	} else {
		// If id is not valid, returns empty string
		if (id.length === 0) return '';

		// Removing trailing / if necessary
		if (id.length > 1 && id.endsWith('/')) id = id.slice(0, -1);

		// Removing default locale from URL if necessary
		if (!params.locale || params.locale === defaultLocale) id = id.replace('/[[locale]]', '/');

		// Resolving the route with SvelteKit resolve function
		try {
			fullURL = resolve(id + search + hash, params);
		} catch (err) {
			console.error('An issue occured when computing an URL :\r\n' + err);
			return '';
		}
	}
	return fullURL;
}
