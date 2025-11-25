import { error } from '@sveltejs/kit';

import { getComponent, getIds, getMetadata } from '$lib/server/articles';

import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => {
	return getIds().ids.map((value) => {
		return { article: value };
	});
};

export const load: PageServerLoad = async ({ params }) => {
	const article = getComponent(params.article);

	if (!article) throw error(404, `Article with id "${params.article}" not found!`);

	return {
		article: {
			id: params.article,
			metadata: getMetadata(params.article, { tags: true, categories: true, excerpt: true })
		}
	};
};
