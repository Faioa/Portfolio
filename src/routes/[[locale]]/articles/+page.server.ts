import { error } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import type { Metadata } from '$lib/articles-types';
import { filtersSchema } from '$lib/articles-types';
import { numberPerPage } from '$lib/articles-types';
import { defaultLocale } from '$lib/lang';
import { getIds, getMetadata } from '$lib/server/articles';

import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ url, params }) => {
	const form = await superValidate(url, zod4(filtersSchema), { errors: true });

	let articles: { total: number; ids: string[] } = { total: 0, ids: [] };
	let metadata: Metadata[] = [];

	if (!form.valid) {
		return { form, articles, metadata };
	}

	const lang = params.locale ?? defaultLocale;
	const page = url.searchParams?.get('page') ? parseInt(url.searchParams.get('page')!) : 1;

	articles = getIds({
		lang,
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
				new Date(form.data.fromDate).valueOf() - new Date(metadata.created).valueOf() > 0
			)
				return false;

			if (
				form.data.toDate &&
				new Date(form.data.toDate).valueOf() - new Date(metadata.created).valueOf() < 0
			)
				return false;

			if (
				form.data.categories.length > 0 &&
				metadata.categories &&
				!form.data.categories.every((value) => metadata.categories!.includes(value))
			)
				return false;

			if (form.data.research && metadata.tags) {
				const keyWords = form.data.research.toLowerCase().split(' ');
				const title = metadata.title.toLowerCase();
				let matching = 0;
				metadata.tags.forEach((tag) => {
					if (keyWords.includes(tag) || title.includes(tag)) matching += 1;
				});
				if (matching == 0 || matching / keyWords.length < 0.5) return false;
			}

			return true;
		},
		limit: numberPerPage,
		start: numberPerPage * (page - 1)
	});

	metadata = articles['ids'].map((article) => {
		const metadata = getMetadata(article, { categories: true, excerpt: true, tags: true });
		if (!metadata) throw error(404);

		return metadata;
	});

	const maxPages = Math.ceil(articles.total / numberPerPage);
	if (maxPages < form.data.page) form.data.page = maxPages;
	return { form, articles, metadata };
};
