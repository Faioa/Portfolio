<script lang="ts">
	import EyeIcon from '@lucide/svelte/icons/eye';

	import type { Metadata } from '$lib/articles-types';
	import Link from '$lib/components/Link.svelte';
	import { cn } from '$lib/utils';

	interface Props {
		article: string;
		metadata: Metadata;
		class?: string;
	}

	const { article, metadata, class: className = '' }: Props = $props();
</script>

<div class={cn('card', className)}>
	<h3 class="w-full text-base font-bold text-wrap md:text-lg">{metadata.title}</h3>

	<div class="max-h-20 min-h-20 md:max-h-35 md:max-w-70">
		<span class="line-clamp-4 truncate text-wrap wrap-break-word md:line-clamp-6">
			{metadata.excerpt}
		</span>
	</div>

	<div class="flex items-center justify-between gap-5">
		<span class="col-span-2 text-sm text-wrap italic">
			Written on {new Date(metadata.created).toLocaleDateString()}
		</span>

		<div class="flex items-center gap-1">
			<Link href="/articles/[article]" args={{ article }} class="text-sm md:text-base">Read More</Link>
			<EyeIcon class="icon" />
		</div>
	</div>
</div>
