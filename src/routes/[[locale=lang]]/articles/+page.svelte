<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { filtersSchema } from '$lib/articles-types';
	import ArticlesFiltersForm from '$lib/components/ArticlesFiltersForm.svelte';
	import ArticlesList from '$lib/components/ArticlesList.svelte';
	import { Separator } from '$lib/components/ui/separator';

	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	/* svelte-ignore state_referenced_locally */
	let form = superForm(data.form, {
		invalidateAll: false,
		resetForm: false,
		validators: zod4Client(filtersSchema)
	});

	let { form: formData } = form;

	let itemsCount = $derived(data.articles.total);
	let articles = $derived(data.articles.ids);
	let metadata = $derived(data.metadata);
</script>

<div class="container">
	<h1 class="title">Articles</h1>

	<ArticlesFiltersForm
		{form}
		bind:dateStart={$formData.dateStart}
		bind:dateEnd={$formData.dateEnd}
		bind:featured={$formData.featured}
		bind:itemsCount
		bind:page={$formData.page}
		bind:perPage={$formData.perPage}
		bind:research={$formData.research}
		bind:sortBy={$formData.sortBy}
		bind:tags={$formData.tags}
	>
		<div class="flex flex-col gap-5">
			<Separator />
			<div class="container my-10">
				<ArticlesList {articles} {metadata} />
			</div>
		</div>
	</ArticlesFiltersForm>
</div>
