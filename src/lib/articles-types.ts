import { z } from 'zod';

import type { Snippet } from 'svelte';

export const categoriesValues = [
	'miscellaneous',
	'music',
	'lute-making',
	'programming',
	'networks',
	'flux-studio',
	'website'
] as const;
export type Category = (typeof categoriesValues)[number];

// Utility function to include labels' translation with Wuchale
export function getCategoryLabel(value: Category) {
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
export const defaultSortBy: SortBy = 'created-';

// Utility function to include labels' translation with Wuchale
export function getSortByLabel(value: SortBy): string {
	if (value === 'created+') return 'Least Recently Created';
	if (value === 'created-') return 'Most Recently Created';
	if (value === 'modified+') return 'Least Recently Modified';
	else return 'Most Recently Modified';
}

/* Schema for the filters' form */
export const filtersSchema = z
	.object({
		sortBy: z.enum(sortByValues).default(defaultSortBy),
		featured: z.boolean().default(false),
		fromDate: z.nullish(z.iso.date()),
		toDate: z.nullish(z.iso.date()),
		categories: z.array(z.enum(categoriesValues)).default([]),
		research: z.nullish(z.string().min(1).trim()),
		page: z.int().min(1).default(1)
	})
	.superRefine((data, ctx) => {
		if (data.fromDate && data.toDate) {
			try {
				const fromDate = new Date(data.fromDate);
				const toDate = new Date(data.toDate);
				if (fromDate > toDate)
					ctx.addIssue({
						code: 'invalid_value',
						origin: 'date',
						message: 'Incorrect range with the selected dates. Check their order and retry.',
						path: ['fromDate'],
						values: [data.fromDate, data.toDate]
					});
			} catch {
				/* fallback to individual validation */
			}
		}
	});

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

/* Types for the mdsvex components */
export type Article = Snippet;

export interface ArticleModule {
	default: Article;
	metadata: Metadata;
}

export const numberPerPage = 3;
