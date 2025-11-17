import { error } from '@sveltejs/kit';

import { getComponent, getMetadata } from '$lib/articles';

export const prerender = true;

export function load({ params }) {
	const article = getComponent(`${params.article}`);

	if (!article) throw error(404, `Article with id "${params.article}" not found!`);

	return {
		article: {
			id: params.article,
			content: article,
			metadata: getMetadata(`${params.article}`, { tags: true, categories: true, excerpt: true })
		}
	};
}
