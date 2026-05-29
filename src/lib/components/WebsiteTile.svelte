<script lang="ts">
	import EyeIcon from '@lucide/svelte/icons/eye';

	import Link from '$lib/components/Link.svelte';
	import { cn } from '$lib/utils';

	interface Props {
		class?: string;
	}

	const { class: className = '' }: Props = $props();
</script>

<div class={cn('tile', className)}>
	<h3 class="subtitle w-full text-base font-bold text-wrap md:text-lg">This Website</h3>

	<p class="line-clamp-4! inline-block w-full truncate text-wrap wrap-break-word md:line-clamp-6!">
		This website is both a portfolio and a blog developed with <span class="font-bold italic">Svelte</span>
		and <span class="font-bold italic">SvelteKit</span>. I will post updates on my projects and experiences, as well as
		anything else I find interesting. It is also a way for you to contact me. This project is an opportunity for me to
		experiment with web development.
	</p>

	<div class="flex flex-row-reverse items-center">
		<Link href="/projects/website" class="text-sm! md:text-base!">
			Read More <EyeIcon class="icon" />
		</Link>
	</div>
</div>
