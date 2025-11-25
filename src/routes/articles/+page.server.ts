import { error, fail } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { type FiltersSchema, filtersSchema, getIds, getMetadata } from '$lib/server/articles';

import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ url }) => {
	const requestedForm = {
		sortBy: url.searchParams.get('sortBy') ? url.searchParams.get('sortBy') : 'created-',
		featured: url.searchParams.get('featured'),
		fromDate: url.searchParams.get('fromDate'),
		toDate: url.searchParams.get('toDate'),
		categories: url.searchParams.get('categories'),
		research: url.searchParams.get('research')?.split(' ')
	} as {
		sortBy: 'created+' | 'created-' | 'modified+' | 'modified-';
	};
	const form = await superValidate(requestedForm, zod4(filtersSchema));

	const articles = getIds({
		sort: (a, b) => {
			return new Date(b.created).valueOf() - new Date(a.created).valueOf();
		}
	});

	const metadata = articles['ids'].map((article) => {
		const metadata = getMetadata(article, { categories: true, excerpt: true, tags: true });
		if (!metadata) throw error(404);

		return metadata;
	});

	return { form, articles, metadata };
};
