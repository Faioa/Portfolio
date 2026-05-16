<script lang="ts">
	import type { Metadata } from '$lib/articles-types';
	import ArticleTile from '$lib/components/ArticleTile.svelte';

	const { articles = $bindable(), metadata = $bindable() } = $props<{ articles: string[]; metadata: Metadata[] }>();
</script>

<div class="grid w-full grid-cols-1 flex-wrap gap-10 truncate md:grid-cols-3">
	{#each articles as article, i (article)}
		<ArticleTile {article} metadata={metadata[i]} class="col-span-1" />
	{:else}
		<p class="col-span-1 md:col-span-3 text-destructive text-center wrap-break-word text-wrap">
			I'm sorry, but there's no available article yet. Please wait a few days for some content to be published!
		</p>
	{/each}
</div>
