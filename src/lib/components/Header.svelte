<script lang="ts">
	import Guitar from "$lib/components/Guitar.svelte";
	import ModeToogle from "$lib/components/ModeToggle.svelte";
	import ListMusic from "@lucide/svelte/icons/list-music";
	import ModeToggle from '$lib/components/ModeToggle.svelte';

	const height = 75;
</script>

<header style="--height: {height}px;">
	<a href="/" class="flex gap-5 h-full">
		<Guitar size="{height}px" animate={false} classes="rotate-25" />

		<div class="flex flex-col justify-center text-2xl font-bold">
			<h1>Matthieu</h1>
			<h1>Dartois</h1>
		</div>
	</a>
	<div class="flex gap-3 h-full items-center">
		<ModeToggle />
		<ListMusic size={height} class="p-5" />
	</div>
</header>

<style>
	header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			line-height: 1;
			height: var(--height);
			width: 100%;
			z-index: 10;
			padding-left: calc(var(--spacing) * 5);
			padding-right: calc(var(--spacing) * 5);
	}
</style>