<script lang="ts">
	import { resolve } from '$app/paths';

	import type { Metadata } from '$lib/server/articles';

	const data = $props();

	const article: string = data.article;
	const metadata: Metadata = data.metadata;
</script>

<div class="card {data.class ? data.class : ''}">
	<div class="flex items-center justify-between gap-5">
		<h3 class="text-lg font-bold">{metadata.title}</h3>
		<p class="text-xs italic">
			Written on {new Date(metadata.created).toLocaleDateString()}
		</p>
	</div>
	<p>{metadata.excerpt}</p>
	<a
		href={resolve('/articles/[article]', { article })}
		class="link mt-1 self-end justify-self-end text-sm">Read More</a
	>
</div>

<style>
</style>
