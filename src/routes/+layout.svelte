<script lang="ts">
	import type { Snapshot } from '@sveltejs/kit';
	import { ModeWatcher } from 'mode-watcher';

	import { tick } from 'svelte';

	import { afterNavigate } from '$app/navigation';

	import favicon from '$lib/assets/favicon.svg';
	import Footer from '$lib/components/Footer.svelte';
	import GoTop from '$lib/components/GoTop.svelte';
	import Header from '$lib/components/Header.svelte';

	import '../app.css';

	let { children } = $props();

	/* Scroll position in pages during navigation */
	export const snapshot: Snapshot<number> = {
		capture: () => window.scrollY,
		restore: async (scrollY) => {
			await tick();
			window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' });
		}
	};

	/* Necessary to start navigating to a new page at its top instead of the position in the previous page due to SvelteKit SPA navigation behavior */
	afterNavigate(({ type }) => {
		if (type !== 'popstate') window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<GoTop />

<div class="relative flex min-h-screen w-full flex-col items-center overflow-hidden">
	<Header class="fixed bg-white/30 backdrop-blur-sm z-100" />

	<main class="relative mt-30 flex w-full grow flex-col items-center justify-center gap-10">
		{@render children?.()}
	</main>

	<Footer />
</div>
