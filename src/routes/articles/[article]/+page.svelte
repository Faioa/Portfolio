<script lang="ts">
	import ClockPlus from '@lucide/svelte/icons/clock-plus';
	import FileClock from '@lucide/svelte/icons/file-clock';

	import { onMount } from 'svelte';

	import type { ArticleModule } from '$lib/articles-types';
	import { Separator } from '$lib/components/ui/separator/index.js';

	const { data } = $props();
	const id = data.id;

	let module: ArticleModule | null = $state(null);

	onMount(async () => {
		module = await import(`$lib/articles/${id}.svx`);
	});
</script>

<div class="container">
	<div class="flex w-full flex-col justify-center gap-5 text-justify">
		<div class="flex w-full justify-between">
			<h1 class="title">{module?.metadata?.title}</h1>

			{#if module?.metadata?.created}
				<div class="flex flex-col items-end justify-center text-sm italic">
					<p class="flex items-center gap-2">
						<ClockPlus class="icon" />Written on {new Date(
							module?.metadata.created
						).toLocaleDateString()}
					</p>

					{#if module?.metadata?.modified && module?.metadata.modified !== module?.metadata.created}
						<p class="flex items-center gap-2">
							<FileClock class="icon" />Modified on {new Date(
								module?.metadata.modified
							).toLocaleDateString()}
						</p>
					{/if}
				</div>
			{/if}
		</div>

		<p>
			{module?.metadata?.excerpt}
		</p>
	</div>
</div>

<Separator class="container" />

<article class="container">
	{@render module?.default?.()}
</article>

<style>
	article {
		gap: calc(var(--spacing) * 10);
	}

	article :global(h1) {
		--tw-font-weight: var(--font-weight-bold);
		font-weight: var(--font-weight-bold);
		font-size: var(--text-2xl);
		line-height: var(--tw-leading, var(--text-2xl--line-height));
	}

	article :global(h2) {
		--tw-font-weight: var(--font-weight-bold);
		font-weight: var(--font-weight-bold);
		font-size: var(--text-xl);
		line-height: var(--tw-leading, var(--text-xl--line-height));
	}

	article :global(h3),
	article :global(h4),
	article :global(h5),
	article :global(h6) {
		--tw-font-weight: var(--font-weight-bold);
		font-weight: var(--font-weight-bold);
		font-size: var(--text-lg);
		line-height: var(--tw-leading, var(--text-lg--line-height));
	}

	article :global(a:hover) {
		opacity: 80%;
		cursor: pointer;
	}

	article :global(a) {
		text-decoration: underline;
		text-underline-offset: 1px;
	}
</style>
