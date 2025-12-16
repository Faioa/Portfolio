import { error } from '@sveltejs/kit';

import { defaultLocale } from '$lib/lang';
import { getIds, getMetadata } from '$lib/server/articles';

import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = ({ params }) => {
	const lang = params.locale ?? defaultLocale;
	const articles = getIds({
		lang,
		limit: 6,
		sort: (a, b) => {
			return new Date(b.created).valueOf() - new Date(a.created).valueOf();
		}
	});

	const metadata = articles['ids'].map((article) => {
		const metadata = getMetadata(article, { excerpt: true });
		if (!metadata)
			throw error(
				500,
				`An issue occurred on the server when getting the metadata of the article ${article}`
			);
		return metadata;
	});

	return { articles, metadata };
};
