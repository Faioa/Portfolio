import { error } from '@sveltejs/kit';

import { getIds, getMetadata } from '$lib/server/articles';

import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = () => {
	const articles = getIds({
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
