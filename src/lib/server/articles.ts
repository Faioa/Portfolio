import { z } from 'zod';

import type { Article, ArticleModule, Category, Metadata } from '$lib/articles-types';

/* Type for the filter's function */
export type MetadataFilter = (metadata: Metadata) => boolean;

/* Type for the sort's function */
export type MetadataSort = (a: Metadata, b: Metadata) => number;

/* Type for the filters' form values */

/* Schema for the filters' form */
export const filtersSchema = z.object({
	sortBy: z.literal(['created+', 'created-', 'modified+', 'modified-']),
	featured: z.nullish(z.boolean().optional()),
	fromDate: z.nullish(z.iso.date().optional()),
	toDate: z.nullish(z.iso.date().optional()),
	categories: z.nullish(z.array(z.string<Category>()).min(1).optional()),
	research: z.nullish(z.array(z.string().min(1)).min(1).optional())
});

export type FiltersSchema = typeof filtersSchema;

/* Importing the articles */
const articleModules = import.meta.glob('/src/lib/articles/*.svx', {
	eager: true
}) as Record<string, ArticleModule>;
const number = Object.keys(articleModules).length;

/**
 * Takes the id of the wanted article and returns it.
 * @param id string representing the id of the article (equals the name of the article in the filesystem, without the .svx extension).
 * @returns the wanted article, or undefined if it doesn't exist.
 */
export function getComponent(id: string): Article | undefined {
	return articleModules[`/src/lib/articles/${id}.svx`]?.default;
}

/**
 * Takes the id of the wanted article and returns its excerpt.
 * @param id string representing the id of the article (equals the name of the article in the filesystem, without the .svx extension).
 * @returns the wanted excerpt, or undefined if it doesn't exist.
 */
export function getExcerpt(id: string): string | undefined {
	return articleModules[`/src/lib/articles/${id}.svx`]?.metadata.excerpt;
}

/**
 * Takes the id of the wanted article and returns its metadata. You can pass optional parameters to get a more complete output.
 * @param id string representing the id of the article (equals the name of the article in the filesystem, without the .svx extension).
 * @param options an object containing booleans. By default, they are initialized to false, so that these fields are not included in the returned metadata.
 * @returns the wanted metadata, or undefined if it doesn't exist.
 */
export function getMetadata(
	id: string,
	options: { tags?: boolean; categories?: boolean; excerpt?: boolean } = {
		tags: false,
		categories: false,
		excerpt: false
	}
): Metadata | undefined {
	const metadata = articleModules[`/src/lib/articles/${id}.svx`]?.metadata;

	if (!metadata) return undefined;

	if (!options.tags) delete metadata.tags;
	if (!options.categories) delete metadata.categories;
	if (!options.excerpt) delete metadata.excerpt;

	return metadata as Metadata;
}

/**
 * This function returns the list of all ids matching the filters giving as input.
 * @param options an object containing optional filters to apply on the output. filter must be of type MetadataFilter, sort must be of type MetadataSort, start is the starting index of the sliced results and limit is a number to define the maximum number of results.
 * @returns an object containing the corresponding ids, and the total amount of ids that matched it.
 */
export function getIds(
	options: { filter?: MetadataFilter; sort?: MetadataSort; start?: number; limit?: number } = {}
): { total: number; ids: string[] } {
	const filter = options.filter;
	const sort = options.sort;
	const start = options.start ? (options.start > 0 ? options.start : 0) : 0;
	const limit = options.limit;

	// Extracting ids
	let ids = Object.keys(articleModules).map(
		(path) => path.split('/').pop()?.replace('.svx', '') || ''
	);

	if (filter)
		ids = ids.filter((id) => {
			const meta = articleModules[`/src/lib/articles/${id}.svx`]?.metadata;
			// Excluding unknown ids
			if (!meta) return false;
			return filter(meta);
		});

	if (sort) {
		ids = ids.sort((a: string, b: string) => {
			const metaA = articleModules[`/src/lib/articles/${a}.svx`]?.metadata;
			const metaB = articleModules[`/src/lib/articles/${b}.svx`]?.metadata;
			if (!metaA || !metaB) return 0;
			return sort(metaA, metaB);
		});
	}

	const total = ids.length;

	if (limit && limit >= 0) ids = ids.slice(start, start + limit);

	return {
		total,
		ids
	};
}

/**
 * This function returns the number of articles available.
 * @returns the number of articles available.
 */
export function getNumber(): number {
	return number;
}
