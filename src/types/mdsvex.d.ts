import type Metadata from '$lib/articles';

declare module '*.svx' {
	import type { SvelteComponent } from 'svelte';

	export default class extends SvelteComponent {}

	export const metadata: Metadata;
}
