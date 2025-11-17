import type { SvelteComponent } from 'svelte';

/* Created and modified properties follow the javascript string datetime format */
export interface Metadata {
	title: string;
	created: string;
	modified: string;
	tags?: string[];
	categories?: string[];
	featured: boolean;
	excerpt?: string;
}

/* Type for the filter's function */
export type MetadataFilter = (metadata: Metadata) => boolean;

/* Type for the sort's function */
export type MetadataSort = (a: Metadata, b: Metadata) => number;

/* Types for the mdsvex components */
export type Article = typeof SvelteComponent;

interface ArticleModule {
	default: Article;
	metadata: Metadata;
}

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
	options: { filter?: MetadataFilter; sort?: MetadataSort; start: number; limit?: number } = {
		start: 0
	}
): { total: number; ids: string[] } {
	const { filter, sort, start, limit } = options;

	// Extracting ids
	let ids = Object.keys(articleModules).map(
		(path) => path.split('/').pop()?.replace('.svx', '') || ''
	);

	if (filter)
		ids = ids.filter((id) => {
			return filter(getMetadata(id) as Metadata);
		});

	if (sort) {
		ids = ids.sort((a: string, b: string) => {
			const metaA = getMetadata(a) as Metadata;
			const metaB = getMetadata(b) as Metadata;
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
