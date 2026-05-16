<script lang="ts">
	import type { Metadata } from '$lib/articles-types';
	import ArticleTile from '$lib/components/ArticleTile.svelte';

	const { articles = $bindable(), metadata = $bindable() } = $props<{ articles: string[]; metadata: Metadata[] }>();
</script>

<div class="grid flex-wrap truncate grid-cols-1 md:grid-cols-3 w-full gap-10">
	{#each articles as article, i (article)}
		<ArticleTile {article} metadata={metadata[i]} class="col-span-1" />
	{:else}
		<p class="text-destructive text-center">I'm sorry, but there's no available article yet. Please wait a few days for some content to be published!</p>
	{/each}
</div>
