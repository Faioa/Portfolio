import { z } from 'zod';

import type { ArticleModule, Category, Metadata } from '$lib/articles-types';

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

/* Importing the articles' metadata and formatting the ids in a map */
const metadata: Map<string, Metadata> = new Map(
	Object.entries(
		import.meta.glob('/src/lib/articles/*.svx', { eager: true }) as Record<string, ArticleModule>
	).map((value) => {
		return [value[0].split('/').pop()?.replace('.svx', '') || '', value[1].metadata];
	})
);

/**
 * Takes the id of the wanted article and returns its excerpt.
 * @param id string representing the id of the article (equals the name of the article in the filesystem, without the .svx extension).
 * @returns the associated excerpt, or undefined if it doesn't exist.
 */
export function getExcerpt(id: string): string | undefined {
	return metadata.get(id)?.excerpt;
}

/**
 * Takes the id of the wanted article and returns its categories.
 * @param id string representing the id of the article (equals the name of the article in the filesystem, without the .svx extension).
 * @returns the associated categories, or undefined if it doesn't exist.
 */
export function getCategories(id: string): string[] | undefined {
	return metadata.get(id)?.categories;
}

/**
 * Takes the id of the wanted article and returns its tags.
 * @param id string representing the id of the article (equals the name of the article in the filesystem, without the .svx extension).
 * @returns the associated tags, or undefined if it doesn't exist.
 */
export function getTags(id: string): string[] | undefined {
	return metadata.get(id)?.tags;
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
	const article = metadata.get(id);

	if (!article) return undefined;

	if (!options.tags) delete article.tags;
	if (!options.categories) delete article.categories;
	if (!options.excerpt) delete article.excerpt;

	return article;
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

	// Getting all the ids
	let ids = Object.values(metadata.keys().toArray());

	if (filter)
		ids = ids.filter((id) => {
			const meta = metadata.get(id);
			// Excluding unknown ids
			if (!meta) return false;
			return filter(meta);
		});

	if (sort) {
		ids = ids.sort((a: string, b: string) => {
			const metaA = metadata.get(a);
			const metaB = metadata.get(b);
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
	return metadata.size;
}
