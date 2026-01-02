<script lang="ts">
	import ClockPlus from '@lucide/svelte/icons/clock-plus';
	import FileClock from '@lucide/svelte/icons/file-clock';

	import { page } from '$app/state';

	import { type ArticleModule, getCategoryLabel } from '$lib/articles-types';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { defaultLocale } from '$lib/lang';

	const lang = $derived(page.params.locale ?? defaultLocale);
	const { data } = $props();
	const id = $derived(data.id);
	let module: ArticleModule | null = $state(null);

	async function updateModule() {
		try {
			module = await import(`$lib/articles/${lang}/${id}.svx`);
		} catch (err) {
			console.error(`Failed to load article ${id} for locale ${lang}:`, err);
			module = null;
		}
	}

	$effect.pre(() => {
		if (!id) return;
		updateModule();
	});
</script>

<div class="container">
	<div class="flex w-full flex-col justify-center gap-3 text-justify">
		<div class="flex w-full justify-between">
			<h1 class="title">{module?.metadata?.title}</h1>

			{#if module?.metadata?.created}
				<div class="flex flex-col items-end justify-center text-sm italic">
					<p class="flex items-center gap-2">
						<ClockPlus class="icon" />Written on {new Date(module?.metadata.created).toLocaleDateString()}
					</p>

					{#if module?.metadata?.modified && module?.metadata.modified !== module?.metadata.created}
						<p class="flex items-center gap-2">
							<FileClock class="icon" />Modified on {new Date(module?.metadata.modified).toLocaleDateString()}
						</p>
					{/if}
				</div>
			{/if}
		</div>

		<p>
			{module?.metadata?.excerpt}
		</p>
		{#if module?.metadata?.categories}
			<div class="flex flex-wrap items-center gap-2">
				{#each module?.metadata?.categories as category ([category, lang])}
					<Badge variant="secondary">{getCategoryLabel(category)}</Badge>
				{/each}
			</div>
		{/if}
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
