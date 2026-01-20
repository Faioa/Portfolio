<script module>
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Link from '$lib/components/Link.svelte';

	export { Link as a, CodeBlock };
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	import type { Metadata } from '$lib/articles-types';

	interface LayoutProps {
		children?: Snippet;
		meta: Metadata;
	}

	const { children }: LayoutProps = $props();
</script>

{@render children?.()}

<style></style>
