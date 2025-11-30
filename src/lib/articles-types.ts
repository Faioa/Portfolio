import { z } from 'zod';

import type { Snippet } from 'svelte';

export const categories = {
	miscellaneous: 'Miscellaneous',
	music: 'Music',
	'lute-making': 'Lute Making',
	programming: 'Programming',
	networks: 'Networks',
	'flux-studio': 'Flux Studio',
	website: 'Website'
} as Record<string, string>;

export const sortBy = {
	'created+': 'Least Recently Created',
	'created-': 'Most Recently Created',
	'modified+': 'Least Recently Modified',
	'modified-': 'Most Recently Modified'
} as Record<string, string>;

export const defaultSortBy = 'created-';

/* Schema for the filters' form */
export const filtersSchema = z.object({
	sortBy: z.literal(Object.keys(sortBy)).default(defaultSortBy),
	featured: z.boolean().default(false),
	fromDate: z.nullish(z.iso.date()),
	toDate: z.nullish(z.iso.date()),
	categories: z.array(z.literal(Object.keys(categories))),
	research: z.nullish(z.string().min(1))
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
