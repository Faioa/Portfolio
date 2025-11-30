import { error, fail } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { filtersSchema } from '$lib/articles-types';
import { getIds, getMetadata } from '$lib/server/articles';

import type { Actions, PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(filtersSchema));

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

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(filtersSchema));

		if (!form.valid) fail(400, form);

		console.log(form.data, form.valid);
		return { form };
	}
} satisfies Actions;
