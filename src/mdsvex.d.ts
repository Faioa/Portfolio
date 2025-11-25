import type { Article, Metadata } from '$lib/articles-types';

declare module '*.svx' {
	export default Article;

	export const metadata: Metadata;
}
