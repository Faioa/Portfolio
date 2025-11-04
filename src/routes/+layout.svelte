<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import GoTop from "$lib/components/GoTop.svelte";
	import { ModeWatcher } from "mode-watcher";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<GoTop />

<div class="flex flex-col items-center w-full min-h-screen">
	<Header />

	<main class="flex flex-col grow gap-10 items-center w-full">
		{@render children()}
	</main>

	<Footer />
</div>