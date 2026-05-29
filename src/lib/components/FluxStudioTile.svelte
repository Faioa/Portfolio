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
	<h3 class="subtitle w-full text-base font-bold text-wrap md:text-lg">Flux Studio</h3>

	<p class="line-clamp-4! inline-block w-full truncate text-wrap wrap-break-word md:line-clamp-6!">
		Flux studio is a soon-to-be developed <span class="font-bold">Digital Audio Workstation</span>
		using <span class="font-bold italic">Rust</span>. My aim is to create a top-notch DAW that can be used for playing
		and learning music. My goals are ambitious, but I will do my best to see this project through nonetheless.
	</p>

	<div class="flex flex-row-reverse items-center">
		<Link href="/projects/flux-studio" class="text-sm! md:text-base!">
			Read More <EyeIcon class="icon" />
		</Link>
	</div>
</div>
