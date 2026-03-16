<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Search from '@lucide/svelte/icons/search';

	import ArticlesList from '$lib/components/ArticlesList.svelte';
	import Guitar from '$lib/components/Guitar.svelte';
	import Link from '$lib/components/Link.svelte';

	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const articles = $derived(data.articles.ids);
	const metadata = $derived(data.metadata);
</script>

<div class="relative flex items-start gap-5">
	<div class="moveUpDown absolute top-[40%] left-[-75%] flex items-center gap-2 whitespace-nowrap">
		<ChevronDown class="icon" />
		<p class="flex">Scroll down or hover the strings...</p>
		<ChevronDown class="icon" />
	</div>

	<Guitar />

	<div class="moveUpDown absolute top-[60%] left-[100%] flex items-center gap-2 whitespace-nowrap">
		<ChevronDown class="icon" />
		<p class="inline-flex gap-1">
			...to animate the guitar!<span class="text-destructive"> (Work in Progress)</span>
		</p>
		<ChevronDown class="icon" />
	</div>
</div>

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
		<Link href="/about" class="underline underline-offset-3">this page</Link>. You can also find my social media, as
		well as a contact form at the
		<Link href="#footer" class="underline underline-offset-3">bottom of each page</Link>, if you want to inquire me
		about something.
	</p>
	<p>I hope you enjoy visiting my website!</p>
</div>

<div class="container">
	<h2 class="title">Featured Projects</h2>
	<div class="grid grid-cols-2 gap-10">
		<div class="card">
			<h2 class="subtitle">Flux Studio</h2>
			<p>
				Flux studio is a soon-to-be developed <span class="font-bold">Digital Audio Workstation</span>
				using <span class="font-bold italic">Rust</span>. My aim is to create a top-notch DAW that can be used for
				playing and learning music. My goals are ambitious, but I will do my best to see this project through
				nonetheless.
			</p>
			<Link href="/projects/flux-studio" class="mt-1 self-end justify-self-end text-sm">Read More</Link>
		</div>

		<div class="card flex flex-col gap-2">
			<h2 class="subtitle">This Website</h2>
			<p>
				This website is both a portfolio and a blog developed with <span class="font-bold italic">Svelte</span>
				and <span class="font-bold italic">SvelteKit</span>. I will post updates on my projects and experiences, as well
				as anything else I find interesting. It is also a way for you to contact me. This project is an opportunity for
				me to experiment with web development.
			</p>
			<Link href="/projects/website" class="mt-1 self-end justify-self-end text-sm">Read More</Link>
		</div>
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

	.moveUpDown {
		animation: MoveUpDown 2s linear infinite;
	}

	@keyframes MoveUpDown {
		0%,
		100% {
			transform: translateY(-5px);
		}
		50% {
			transform: translateY(5px);
		}
	}
</style>
