<script lang="ts">
	import ClockPlus from '@lucide/svelte/icons/clock-plus';
	import FileClock from '@lucide/svelte/icons/file-clock';

	const { data } = $props();

	const { id, content: Article, metadata } = data.article;
</script>

<div class="container">
	<div class="flex w-full flex-col justify-center gap-5 text-justify">
		<div class="flex w-full justify-between">
			<h1 class="title">{metadata?.title}</h1>

			{#if metadata?.created}
				<div class="flex flex-col items-end justify-center text-sm italic">
					<p class="flex items-center gap-2">
						<ClockPlus class="icon" />Written on {new Date(metadata.created).toLocaleDateString()}
					</p>

					{#if metadata?.modified && metadata.modified !== metadata.created}
						<p class="flex items-center gap-2">
							<FileClock class="icon" />Modified on {new Date(
								metadata.modified
							).toLocaleDateString()}
						</p>
					{/if}
				</div>
			{/if}
		</div>

		<p>
			{metadata?.excerpt}
		</p>
	</div>
</div>

<div class="container border-b-2"></div>

<article class="container">
	<Article />
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
