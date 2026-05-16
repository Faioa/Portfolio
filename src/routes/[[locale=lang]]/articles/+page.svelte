<script lang="ts">
	import ArticlesFiltersForm from '$lib/components/ArticlesFiltersForm.svelte';
	import ArticlesList from '$lib/components/ArticlesList.svelte';
	import { Separator } from '$lib/components/ui/separator';

	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let itemsCount = $derived(data.articles.total);
	let articles = $derived(data.articles.ids);
	let metadata = $derived(data.metadata);
</script>

<div class="container">
	<h1 class="title">Articles</h1>

	<ArticlesFiltersForm formProp={data.form} bind:itemsCount>
		<div class="flex flex-col gap-5">
			<Separator />
			<div class="my-10">
				<ArticlesList {articles} {metadata} />
			</div>
		</div>
	</ArticlesFiltersForm>
</div>
