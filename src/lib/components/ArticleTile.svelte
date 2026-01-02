<script lang="ts">
	import type { Metadata } from '$lib/articles-types';
	import Link from '$lib/components/Link.svelte';

	const data = $props();

	const article: string = data.article;
	const metadata: Metadata = data.metadata;
</script>

<div class="card {data.class ? data.class : ''}">
	<div class="flex items-center justify-between gap-5">
		<h3 class="text-lg font-bold">{metadata.title}</h3>
		<p class="text-xs italic">
			Written on {new Date(metadata.created).toLocaleDateString()}
		</p>
	</div>
	<p>{metadata.excerpt}</p>
	<Link href="/articles/[article]" args={ {article} } class="mt-1 self-end justify-self-end text-sm">
		Read More
	</Link>
</div>

<style>
</style>
