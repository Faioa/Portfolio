<script lang="ts">
	import type { Metadata } from '$lib/articles-types';
	import ArticleTile from '$lib/components/ArticleTile.svelte';

	const { articles = $bindable(), metadata = $bindable() } = $props<{ articles: string[]; metadata: Metadata[] }>();
</script>

<div class="articles">
	{#each articles as article, i (article)}
		<ArticleTile {article} metadata={metadata[i]} class="article" />
	{:else}
		<p>I'm sorry, but there's no available article yet. Please wait a few days for some content to be published!</p>
	{/each}
</div>

<style>
	.articles {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		width: 100%;
		gap: calc(var(--spacing) * 10);
	}

	.articles :global(.article) {
		max-width: calc(33.333% - var(--spacing) * 10);
	}
</style>
