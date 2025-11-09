<script lang="ts">
	import { slide } from "svelte/transition"
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import ListMusic from '@lucide/svelte/icons/list-music';
	import { Button } from "$lib/components/ui/button/index.js"
	import { browser } from "$app/environment";

	const { height = "100%" } = $props();

	let visible = $state(false);
</script>

<nav class="inline-block relative h-full z-10" onmouseenter={() => visible = true} onmouseleave={() => visible = false}>
	<ListMusic size={height} class="p-4" />

	{#if visible}
		<div class="content" transition:slide={{duration: 250}}>
			<ChevronUp class="icon relative left-[50%] translate-x-[-50%]" />
			<div class="flex flex-col text-center gap-2">
				<Button href="/about" variant="ghost">About</Button>
				<hr />
				<Button href="/articles" variant="ghost">Articles</Button>
				<hr />
				<Button href="/contact" variant="ghost">Contact</Button>
				<hr />
				<Button href="/projects" variant="ghost">Projects</Button>
			</div>
		</div>
	{/if}

	{#if !browser}
		<!-- Fallback JS disabled -->
		<noscript>
			<div class="content">
				<ChevronUp class="icon relative left-[50%] translate-x-[-50%]" />
				<div class="flex flex-col text-center gap-2">
					<Button href="/about" variant="ghost">About</Button>
					<hr />
					<Button href="/articles" variant="ghost">Articles</Button>
					<hr />
					<Button href="/contact" variant="ghost">Contact</Button>
					<hr />
					<Button href="/projects" variant="ghost">Projects</Button>
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