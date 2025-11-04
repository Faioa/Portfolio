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

<div class="flex flex-col gap-10 items-center w-full min-h-screen">
	<Header />
	{@render children()}
	<GoTop />
	<Footer />
</div>