<script lang="ts">
	import SearchIcon from '@lucide/svelte/icons/search';

	import ArticlesList from '$lib/components/ArticlesList.svelte';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { Button } from '$lib/components/ui/button/index';
	import * as Form from '$lib/components/ui/form/index';
	import * as InputGroup from '$lib/components/ui/input-group/index';
	import { Separator } from '$lib/components/ui/separator/index';
	import * as Sheet from '$lib/components/ui/sheet/index';

	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const articles = data.articles;
	const metadata = data.metadata;

	let sheetClose: HTMLButtonElement | null = $state(null);
</script>

<div class="container">
	<h1 class="title">Articles</h1>

	<!-- Form for the filters and research bar -->
	<form class="flex w-full gap-5" action="/articles">
		<!-- Input for the research bar -->
		<InputGroup.Root class="rounded-2xl">
			<InputGroup.Input name="research" placeholder="Search..." />

			<InputGroup.Addon>
				<SearchIcon />
			</InputGroup.Addon>

			<InputGroup.Addon align="inline-end">
				<InputGroup.Button variant="ghost" class="rounded-2xl" type="submit">Search</InputGroup.Button>
			</InputGroup.Addon>
		</InputGroup.Root>

		<!-- Filters' sheet -->
		<Sheet.Root>
			<Sheet.Trigger
				class="flex items-center rounded-2xl
								{buttonVariants.variants.variant.outline}
								{buttonVariants.variants.size.default}"
			>
				Filters
			</Sheet.Trigger>

			<Sheet.Content class="flex flex-col items-center">
				<Sheet.Header class="flex flex-col items-center justify-center gap-3">
					<Sheet.Close bind:ref={sheetClose}></Sheet.Close>

					<Sheet.Title class="subtitle">Filters</Sheet.Title>

					<Sheet.Description class="text-center">
						Select the filters you want to use for your research.
					</Sheet.Description>

					<Separator />
				</Sheet.Header>

				<!-- Filters' form fields -->
				<div>TEST</div>

				<!-- Filters' submit button -->
				<Sheet.Footer>
					<Button
						type="submit"
						variant="outline"
						class="rounded-2xl"
						onclick={() => {
							sheetClose?.click();
						}}>Apply</Button
					>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Root>
	</form>
</div>

<Separator class="container" />

<div class="container">
	<ArticlesList articles={articles.ids} {metadata} />
</div>
