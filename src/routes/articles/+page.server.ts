import { parseDate } from '@internationalized/date';
import { error, fail } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import type { Metadata } from '$lib/articles-types';
import { filtersSchema } from '$lib/articles-types';
import { getIds, getMetadata } from '$lib/server/articles';

import type { Actions, PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ parent }) => {
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

		const articles = getIds({
			sort: (a, b) => {
				if (form.data.sortBy === 'created-')
					return new Date(b.created).valueOf() - new Date(a.created).valueOf();
				else if (form.data.sortBy === 'created+')
					return new Date(a.created).valueOf() - new Date(b.created).valueOf();
				else if (form.data.sortBy === 'modified-')
					return new Date(b.modified).valueOf() - new Date(a.modified).valueOf();
				else return new Date(a.modified).valueOf() - new Date(b.modified).valueOf();
			},
			filter: (metadata: Metadata) => {
				if (form.data.featured && !metadata.featured) return false;

				if (
					form.data.fromDate &&
					new Date(form.data.fromDate).getDate() - new Date(metadata.created).getDate() > 0
				)
					return false;

				if (
					form.data.toDate &&
					new Date(form.data.toDate).getDate() - new Date(metadata.created).getDate() < 0
				)
					return false;

				if (
					form.data.categories &&
					metadata.categories &&
					!form.data.categories.every((value) => metadata.categories!.includes(value))
				)
					return false;

				if (form.data.research && metadata.tags) {
					const keyWords = form.data.research.toLowerCase().split(' ');
					let matching = 0;
					metadata.tags.forEach((tag) => {
						if (keyWords.includes(tag)) matching += 1;
					});
					if (matching / keyWords.length < 0.5) return false;
				}

				return true;
			}
		});

		const metadata = articles['ids'].map((article) => {
			const metadata = getMetadata(article, { categories: true, excerpt: true, tags: true });
			if (!metadata) throw error(404);

			return metadata;
		});

		return { form, articles, metadata };
	}
} satisfies Actions;
