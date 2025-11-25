import type { Snippet } from 'svelte';

export type Category =
	| 'miscellaneous'
	| 'music'
	| 'lute-making'
	| 'programming'
	| 'networks'
	| 'flux-studio'
	| 'website';

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
