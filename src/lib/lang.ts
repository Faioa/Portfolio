export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function urlIsExternal(href: string, origin: string): boolean {
	try {
		const url = new URL(href, origin);
		return url.origin !== origin;
	} catch {
		return false;
	}
}

export function getUrl(href: string, isExternal: boolean, id: string, locale: string | null | undefined) {
	// If link is external, nothing to do
	if (isExternal) return href;

	let fullURL = '';
	if (href.startsWith('/')) {
		// href is absolute
		// Base URL with correct locale parameter
		const baseURL = locale && locale !== defaultLocale ? `/${locale}/` : '/';
		fullURL = baseURL.concat(href.slice(1));
	} else {
		// href is relative
		fullURL = id;
		if (fullURL.endsWith('/')) {
			if (href.startsWith('#') || href.startsWith('?')) {
				fullURL = fullURL.slice(0, -1);
			}
		} else {
			if (!href.startsWith('#') && !href.startsWith('?')) {
				fullURL = fullURL.concat('/');
			}
		}
		fullURL = fullURL.concat(href);
	}
	return fullURL;
}
