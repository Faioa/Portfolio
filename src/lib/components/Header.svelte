<script lang="ts">
	import ModeToggle from '$lib/components/ModeToggle.svelte';
	import Guitar from "$lib/components/Guitar.svelte";
	import NavMenu from "$lib/components/NavMenu.svelte";

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

	<noscript>
		<span class="text-center text-destructive">Please activate Javascript to use the website as it depends heavily on animations and events.</span>
	</noscript>

	<div class="flex gap-3 h-full items-center">
		<NavMenu />
		<ModeToggle />
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