import { error } from '@sveltejs/kit';

import { type Locale, defaultLocale, locales } from '$lib/lang';
import { exists, getIds } from '$lib/server/articles';

import type { EntryGenerator } from './$types';
import type { PageServerLoad } from './$types';

export const entries: EntryGenerator = () => {
	const articles: Array<{ locale: Locale; article: string }> = [];

	for (const locale of locales) {
		const ids = getIds({ lang: locale }).ids;
		ids.forEach((id) => {
			articles.push({
				locale,
				article: id
			});
		});
	}

	return articles;
};

export const load: PageServerLoad = ({ params }) => {
	const lang = (params.locale as Locale) ?? defaultLocale;
	if (!exists(params.article, lang)) {
		error(404, `The article with id ${params.article} doesn't exist.`);
	}
	return { id: params.article };
};
