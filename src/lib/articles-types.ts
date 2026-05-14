import { z } from 'zod';

import type { Snippet } from 'svelte';

/* Created and modified properties follow the JavaScript string datetime format */
export interface Metadata {
	title: string;
	created: string;
	modified: string;
	tags?: string[];
	categories?: Tag[];
	featured: boolean;
	excerpt?: string;
}

/* Types for the mdsvex components */
export type Article = Snippet;

export interface ArticleModule {
	default: Article;
	metadata: Metadata;
}

export const tagsValues = [
	'miscellaneous',
	'music',
	'lute-making',
	'programming',
	'networks',
	'flux-studio',
	'website'
] as const;
export type Tag = (typeof tagsValues)[number];

// Utility function to include labels' translation with Wuchale
export function getTagLabel(value: Tag) {
	if (value === 'miscellaneous') return 'Miscellaneous';
	if (value === 'music') return 'Music';
	if (value === 'lute-making') return 'Lute Making';
	if (value === 'programming') return 'Programming';
	if (value === 'networks') return 'Networks';
	if (value === 'flux-studio') return 'Flux Studio';
	else return 'Website';
}

export const sortByValues = ['created+', 'created-', 'modified+', 'modified-'] as const;
export type SortBy = (typeof sortByValues)[number];

// Utility function to include labels' translation with Wuchale
export function getSortByLabel(value: SortBy): string {
	if (value === 'created+') return 'Created ➘';
	if (value === 'created-') return 'Created ➚';
	if (value === 'modified+') return 'Modified ➘';
	else return 'Modified ➚';
}

export const defaultFeatured: boolean | undefined = false;
export const defaultPage: number = 1;
export const defaultPerPage: number = 6;
export const defaultSortBy: SortBy | undefined = 'created-';

/*
 * Schema for the filters' form
 */
export const filtersSchema = z
	.object({
		dateStart: z.iso.date({ error: () => 'Invalid ISO date format: YYYY-MM-DD.' }).optional(),
		dateEnd: z.iso.date({ error: () => 'Invalid ISO date format: YYYY-MM-DD.' }).optional(),
		featured: z.coerce
			.boolean({ error: () => 'Should be a boolean: true or false.' })
			.optional()
			.default(defaultFeatured),
		page: z.coerce
			.number({ error: () => 'Field page should be a number.' })
			.int({ error: () => 'Invalid page number. Should be an integer.' })
			.min(1, { error: () => 'Should be at least 1 page.' })
			.optional()
			.default(defaultPage),
		perPage: z.coerce
			.number({ error: () => 'Field perPage should be a number.' })
			.int({ error: () => 'Invalid item number per page. Should be an integer.' })
			.min(1, { error: () => 'Should be at least 1 item per page.' })
			.optional()
			.default(defaultPerPage),
		research: z
			.string()
			.trim()
			.transform((v) => (v.length > 0 ? v : undefined))
			.optional(),
		sortBy: z
			.literal(sortByValues, { error: () => `Invalid sort method. Should be one of: ${sortByValues}.` })
			.optional()
			.default(defaultSortBy),
		tags: z
			.array(z.enum(tagsValues, { error: () => `Invalid tags. Should be at least one of: ${tagsValues}.` }))
			.optional()
	})
	.refine(
		(data) => {
			if (data.dateStart && data.dateEnd) {
				return new Date(data.dateStart) <= new Date(data.dateEnd);
			}
			return true;
		},
		{ error: () => 'Field dateStart should be earlier than dateEnd.', path: ['dateEnd'] }
	);

export type FiltersSchema = typeof filtersSchema;
