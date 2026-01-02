<script lang="ts">
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import ListMusic from '@lucide/svelte/icons/list-music';

	import { slide } from 'svelte/transition';

	import { browser } from '$app/environment';

	import Link from '$lib/components/Link.svelte';
	import { Button } from '$lib/components/ui/button/index';

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
				<Link href="/">
					<Button variant="ghost">Home</Button>
				</Link>
				<hr />
				<Link href="/about">
					<Button variant="ghost">About</Button>
				</Link>
				<hr />
				<Link href="/articles">
					<Button variant="ghost">Articles</Button>
				</Link>
				<hr />
				<Link href="/projects">
					<Button variant="ghost">Projects</Button>
				</Link>
				<hr />
				<Link href="/contact">
					<Button variant="ghost">Contact</Button>
				</Link>
			</div>
		</div>
	{/if}

	{#if !browser}
		<!-- Fallback JS disabled -->
		<noscript>
			<div class="content">
				<ChevronUp class="icon relative left-[50%] translate-x-[-50%]" />
				<div class="flex flex-col gap-2 text-center">
					<Link href="/">
						<Button variant="ghost">Home</Button>
					</Link>
					<hr />
					<Link href="/about">
						<Button variant="ghost">About</Button>
					</Link>
					<hr />
					<Link href="/articles">
						<Button variant="ghost">Articles</Button>
					</Link>
					<hr />
					<Link href="/projects">
						<Button variant="ghost">Projects</Button>
					</Link>
					<hr />
					<Link href="/contact">
						<Button variant="ghost">Contact</Button>
					</Link>
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
