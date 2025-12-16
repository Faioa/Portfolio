<script lang="ts">
	import type { Snapshot } from '@sveltejs/kit';
	import { ModeWatcher } from 'mode-watcher';

	import { afterNavigate } from '$app/navigation';

	import favicon from '$lib/assets/favicon.svg';
	import Footer from '$lib/components/Footer.svelte';
	import GoTop from '$lib/components/GoTop.svelte';
	import Header from '$lib/components/Header.svelte';

	import '../../app.css';

	let { children } = $props();

	/* Position in pages during navigation */
	export const snapshot: Snapshot<number> = {
		capture: () => window.scrollY,
		restore: (previousScrollY) => {
			window.scrollTo({ top: previousScrollY, left: 0, behavior: 'instant' });
		}
	};

	afterNavigate(({ type }) => {
		if (type !== 'popstate') window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<GoTop />

<div class="flex min-h-screen w-full flex-col items-center overflow-hidden">
	<Header />

	<main class="flex w-full grow flex-col items-center justify-center gap-10">
		{@render children?.()}
	</main>

	<Footer />
</div>
