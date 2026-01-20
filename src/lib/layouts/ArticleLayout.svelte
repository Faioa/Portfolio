<script module>
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Link from '$lib/components/Link.svelte';

	// eslint-disable-next-line no-import-assign
	export { Link as a, CodeBlock };
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	import type { Metadata } from '$lib/articles-types';

	interface LayoutProps {
		children?: Snippet;
		meta: Metadata;
	}

	// eslint-disable-next-line svelte/no-unused-props
	const { children }: LayoutProps = $props();
</script>

{@render children?.()}

<style></style>
