<script lang="ts">
	import ArticlesList from '$lib/components/ArticlesList.svelte';

	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const articles = data.articles;
	const metadata = data.metadata;
</script>

<ArticlesList {articles} {metadata} />
