<script lang="ts">
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import ListMusic from '@lucide/svelte/icons/list-music';

	import { slide } from 'svelte/transition';

	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';

	import { Button } from '$lib/components/ui/button/index.js';

	const { height = '100%' } = $props();

	let visible = $state(false);
</script>

<nav
	class="relative z-10 inline-block h-full"
	onmouseenter={() => (visible = true)}
	onmouseleave={() => (visible = false)}
>
	<ListMusic size={height} class="p-4" />

	{#if visible}
		<div class="content" transition:slide={{ duration: 250 }}>
			<ChevronUp class="icon relative left-[50%] translate-x-[-50%]" />
			<div class="flex flex-col gap-2 text-center">
				<Button href={resolve('/')} variant="ghost">Home</Button>
				<hr />
				<Button href={resolve('/about')} variant="ghost">About</Button>
				<hr />
				<Button href={resolve('/articles')} variant="ghost">Articles</Button>
				<hr />
				<Button href={resolve('/contact')} variant="ghost">Contact</Button>
				<hr />
				<Button href={resolve('/projects')} variant="ghost">Projects</Button>
			</div>
		</div>
	{/if}

	{#if !browser}
		<!-- Fallback JS disabled -->
		<noscript>
			<div class="content">
				<ChevronUp class="icon relative left-[50%] translate-x-[-50%]" />
				<div class="flex flex-col gap-2 text-center">
					<Button href={resolve('/')} variant="ghost">Home</Button>
					<hr />
					<Button href={resolve('/about')} variant="ghost">About</Button>
					<hr />
					<Button href={resolve('/articles')} variant="ghost">Articles</Button>
					<hr />
					<Button href={resolve('/contact')} variant="ghost">Contact</Button>
					<hr />
					<Button href={resolve('/projects')} variant="ghost">Projects</Button>
				</div>
			</div>
		</noscript>
	{/if}
</nav>

<style>
	.content {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%) translateY(100%);
	}

	nav noscript {
		display: none;
	}

	nav:hover noscript {
		display: block;
	}
</style>
