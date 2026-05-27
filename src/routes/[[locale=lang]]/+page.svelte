<script lang="ts">
	import Search from '@lucide/svelte/icons/search';

	import ArticlesList from '$lib/components/ArticlesList.svelte';
	import FluxStudioTile from '$lib/components/FluxStudioTile.svelte';
	import Link from '$lib/components/Link.svelte';
	import WebsiteTile from '$lib/components/WebsiteTile.svelte';

	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const articles = $derived(data.articles.ids);
	const metadata = $derived(data.metadata);
</script>

<div class="welcome container">
	<p class="title">Welcome!</p>
	<p>
		This platform is a mean for you to get information about my projects or myself, and a mean for me to keep a trace of
		my activities.
	</p>
	<p>
		I will not put to much information on this landing page to keep it minimalistic and clean. The different sections
		below will serve as an introduction to all the content available here.
	</p>
	<p>
		To learn more about me, you can check
		<Link href="/about" class="link">this page</Link>. You can also find my social media, as well as a contact form at
		the
		<Link href="#footer" class="link">bottom of each page</Link>, if you want to inquire me about something.
	</p>
	<p>I hope you enjoy visiting my website!</p>
</div>

<div class="container">
	<h2 class="title">Featured Projects</h2>
	<div class="grid grid-cols-1 gap-10 md:grid-cols-2">
		<FluxStudioTile class="col-span-1" />
		<WebsiteTile class="col-span-1" />
	</div>
</div>

<div class="container">
	<h2 class="title">Recent Articles</h2>
	<ArticlesList {articles} {metadata} />
	{#if articles.length > 0}
		<Link href="/articles" class="mt-1 flex items-center gap-2 self-center text-sm font-bold">
			<Search class="icon" />Browse More Articles
		</Link>
	{/if}
</div>

<style>
	.welcome {
		text-align: center;
	}
</style>
