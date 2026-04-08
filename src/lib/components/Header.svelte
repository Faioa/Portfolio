<script lang="ts">
	import Guitar from '$lib/components/Guitar.svelte';
	import LangChanger from '$lib/components/LangChanger.svelte';
	import Link from '$lib/components/Link.svelte';
	import ModeToggle from '$lib/components/ModeToggle.svelte';
	import NavMenu from '$lib/components/NavMenu.svelte';

	const height = 75;
</script>

<header style="--height: {height}px;" class="border-b-2 border-b-secondary flex flex-row-reverse">
	<noscript>
		<span class="text-center text-destructive">
			Please activate Javascript to use the website as it depends heavily on animations and events.
		</span>
	</noscript>

	<div class="flex h-full items-center gap-3">
		<NavMenu />
		<LangChanger />
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
		margin-bottom: calc(var(--spacing) * 10);
	}
</style>
