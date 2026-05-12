import { getLocalTimeZone } from '@internationalized/date';
import { error } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import type { Metadata } from '$lib/articles-types';
import { filtersSchema } from '$lib/articles-types';
import { defaultPerPage } from '$lib/articles-types';
import { type Locale, defaultLocale } from '$lib/lang';
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

	const lang = (params.locale as Locale) ?? defaultLocale;

	articles = getIds({
		lang,
		sort: (a, b) => {
			if (form.data.sortBy === 'created-') return new Date(b.created).valueOf() - new Date(a.created).valueOf();
			else if (form.data.sortBy === 'created+') return new Date(a.created).valueOf() - new Date(b.created).valueOf();
			else if (form.data.sortBy === 'modified-') return new Date(b.modified).valueOf() - new Date(a.modified).valueOf();
			else return new Date(a.modified).valueOf() - new Date(b.modified).valueOf();
		},
		filter: (metadata: Metadata) => {
			if (form.data.featured && !metadata.featured) return false;

			if (form.data.dateStart) return new Date(form.data.dateStart) <= new Date(metadata.created);

			if (form.data.dateEnd) return new Date(form.data.dateEnd) >= new Date(metadata.created);

			if (
				metadata.categories &&
				form.data.tags &&
				form.data.tags.length > 0 &&
				!form.data.tags.every((value) => metadata.categories!.includes(value))
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
		limit: form.data.perPage,
		start: form.data.perPage * (form.data.page - 1)
	});

	metadata = articles['ids'].map((article) => {
		const metadata = getMetadata(article, { lang, categories: true, excerpt: true, tags: true });
		if (!metadata) throw error(404);

		return metadata;
	});

	return { form, articles, metadata };
};
