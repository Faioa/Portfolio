import { error } from '@sveltejs/kit';

import { getIds, getMetadata } from '$lib/articles';

import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = () => {
	const articles = getIds({
		limit: 6,
		sort: (a, b) => {
			return new Date(b.created).valueOf() - new Date(a.created).valueOf();
		}
	});

	const metadata = articles['ids'].map((article) => {
		const metadata = getMetadata(article, { excerpt: true });
		if (!metadata) throw error(404);
		return metadata;
	});

	return { articles: articles['ids'], metadata };
};
