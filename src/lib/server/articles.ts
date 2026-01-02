import { type ArticleModule, type Metadata } from '$lib/articles-types';
import { type Locale, defaultLocale } from '$lib/lang';

/* Type for the filter's function */
export type MetadataFilter = (metadata: Metadata) => boolean;

/* Type for the sort's function */
export type MetadataSort = (a: Metadata, b: Metadata) => number;

/* Importing the articles' metadata and formatting the ids in a map */
const metadata: Map<string, Map<string, Metadata>> = new Map<string, Map<string, Metadata>>();
Object.entries(
	import.meta.glob('/src/lib/articles/**/*.svx', { eager: true }) as Record<string, ArticleModule>
).forEach(([key, module]) => {
	const article = key.split('/').slice(-2);

	// Removing '.svx' extension
	article[1] = article[1].replace('.svx', '');

	// Verifying language of article based on its directory
	if (!metadata.has(article[0])) metadata.set(article[0], new Map<string, Metadata>());
	metadata.get(article[0])!.set(article[1], module.metadata);
});

/**
 * Takes the id of the wanted article and returns its excerpt.
 * @param id string representing the id of the article (equals the name of the article in the filesystem, without the .svx extension).
 * @param lang language id of the article (ex: en, fr, es, ...)
 * @returns the associated excerpt, or undefined if it doesn't exist.
 */
export function getExcerpt(id: string, lang: Locale = defaultLocale): string | undefined {
	return metadata.get(lang)?.get(id)?.excerpt;
}

/**
 * Takes the id of the wanted article and returns its categories.
 * @param id string representing the id of the article (equals the name of the article in the filesystem, without the .svx extension).
 * @param lang language id of the article (ex: en, fr, es, ...)
 * @returns the associated categories, or undefined if it doesn't exist.
 */
export function getCategories(id: string, lang: Locale = defaultLocale): string[] | undefined {
	return metadata.get(lang)?.get(id)?.categories;
}

/**
 * Takes the id of the wanted article and returns its tags.
 * @param id string representing the id of the article (equals the name of the article in the filesystem, without the .svx extension).
 * @param lang language id of the article (ex: en, fr, es, ...)
 * @returns the associated tags, or undefined if it doesn't exist.
 */
export function getTags(id: string, lang: Locale = defaultLocale): string[] | undefined {
	return metadata.get(lang)?.get(id)?.tags;
}

/**
 * Takes the id of the wanted article and returns its metadata. You can pass optional parameters to get a more complete output.
 * @param id string representing the id of the article (equals the name of the article in the filesystem, without the .svx extension).
 * @param options an object containing booleans. By default, they are initialized to false, so that these fields are not included in the returned metadata.
 * @returns the wanted metadata, or undefined if it doesn't exist.
 */
export function getMetadata(
	id: string,
	options: { lang?: Locale; tags?: boolean; categories?: boolean; excerpt?: boolean } = {
		tags: false,
		categories: false,
		excerpt: false
	}
): Metadata | undefined {
	const lang = options.lang ?? defaultLocale;

	const article = metadata.get(lang)?.get(id);

	if (!article) return undefined;

	if (!options.tags) delete article.tags;
	if (!options.categories) delete article.categories;
	if (!options.excerpt) delete article.excerpt;

	return article;
}

/**
 * This function returns the list of all ids matching the filters giving as input.
 * @param options an object containing optional filters to apply on the output. 'lang' is the language id of the article
 * (ex: en, fr, es, ...). 'filter' must be of type MetadataFilter, 'sort' must be of type MetadataSort, 'start' is the
 * starting index of the sliced results and 'limit' is the maximum number of results.
 * @returns an object containing the corresponding ids, and the total amount of ids that matched it.
 */
export function getIds(options?: {
	lang?: Locale;
	filter?: MetadataFilter;
	sort?: MetadataSort;
	start?: number;
	limit?: number;
}): { total: number; ids: string[] } {
	const lang = options?.lang ?? defaultLocale;
	const filter = options?.filter;
	const sort = options?.sort;
	let start = options?.start ? (options?.start > 0 ? options?.start : 0) : 0;
	const limit = options?.limit;

	// Getting all the ids
	const metaLang = metadata.get(lang);
	if (!metaLang) return { total: 0, ids: [] };
	let ids = Object.values(metaLang.keys().toArray());

	if (filter)
		ids = ids.filter((id) => {
			const meta = metaLang.get(id);
			// Excluding unknown ids
			if (!meta) return false;
			return filter(meta);
		});

	if (sort) {
		ids = ids.sort((a: string, b: string) => {
			const metaA = metaLang.get(a);
			const metaB = metaLang.get(b);
			if (!metaA || !metaB) return 0;
			return sort(metaA, metaB);
		});
	}

	const total = ids.length;

	if (limit) {
		if (start >= total) start = total - limit >= 0 ? total - limit : 0;
		ids = ids.slice(start, start + limit);
	}

	return {
		total,
		ids
	};
}

/**
 * This function returns the number of articles available.
 * @param lang language id of the article (ex: en, fr, es, ...)
 * @returns the number of articles available.
 */
export function getNumber(lang: Locale = defaultLocale): number {
	return metadata.get(lang)?.size ?? 0;
}

/**
 * This function returns true if the given id is part of the known articles
 * @param id id of the wanted article
 * @param lang language id of the article (ex: en, fr, es, ...)
 * @returns true if the article exists. Else, it returns false.
 */
export function exists(id: string, lang: Locale = defaultLocale): boolean {
	return metadata.get(lang) ? metadata.get(lang)!.has(id) : false;
}
