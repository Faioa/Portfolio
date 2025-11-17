<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Search from '@lucide/svelte/icons/search';

	import { resolve } from '$app/paths';

	import Guitar from '$lib/components/Guitar.svelte';

	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const articles = data.articles;
	const metadata = data.metadata;
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
	<p class="title my-10 w-full">Welcome!</p>
	<p>
		This platform is a mean for you to get information about my projects or myself, and a mean for
		me to keep a trace of my activities.
	</p>
	<p>
		I will not put to much information on this landing page to keep it minimalistic and clean. The
		different sections below will serve as an introduction to all the content available here.
	</p>
	<p>
		To learn more about me, you can check <a
			href={resolve('/about', {})}
			class="link underline underline-offset-3">this page</a
		>, and at the
		<a href="#footer" class="link underline underline-offset-3">bottom of the page</a>, you can find
		my social media, as well as a contact form, if you want to inquire me about something.
	</p>
	<p>I hope you enjoy visiting my website!</p>
</div>

<div class="container">
	<h2 class="title w-full text-center">Featured Projects</h2>
	<div class="my-10 grid grid-cols-2 gap-10">
		<div class="card">
			<h2 class="subtitle">Flux Studio</h2>
			<p>
				Flux studio is a soon-to-be developed <span class="font-bold"
					>Digital Audio Workstation</span
				>
				using <span class="font-bold italic">Rust</span>. My aim is to create a top-notch DAW that
				can be used for playing and learning music. My goals are ambitious, but I will do my best to
				see this project through nonetheless.
			</p>
			<a
				href={resolve('/projects/flux-studio', {})}
				class="link mt-1 self-end justify-self-end text-sm">Read More</a
			>
		</div>

		<div class="card flex flex-col gap-2">
			<h2 class="subtitle">This Website</h2>
			<p>
				This website is both a portfolio and a blog developed with <span class="font-bold italic"
					>Svelte</span
				>
				and <span class="font-bold italic">SvelteKit</span>. I will post updates on my projects and
				experiences, as well as anything else I find interesting. It is also a way for you to
				contact me. This project is an opportunity for me to experiment with web development.
			</p>
			<a href={resolve('/projects/website', {})} class="link mt-1 self-end justify-self-end text-sm"
				>Read More
			</a>
		</div>
	</div>
</div>

<div class="container">
	<h2 class="title">Recent Articles</h2>
	<div class="articles">
		{#each articles as article, i (i)}
			<div class="card">
				<div class="flex items-center justify-between gap-5">
					<h3 class="text-lg font-bold">{metadata[i].title}</h3>
					<p class="text-xs italic">
						Written on {new Date(metadata[i].created).toLocaleDateString()}
					</p>
				</div>
				<p>{metadata[i].excerpt}</p>
				<a
					href={resolve('/articles/[article]', { article })}
					class="link mt-1 self-end justify-self-end text-sm">Read More</a
				>
			</div>
		{:else}
			<p>
				I'm sorry, but there's no available article yet. Please wait a few days for some content to
				be published!
			</p>
		{/each}
	</div>
	{#if articles.length > 0}
		<a
			href={resolve('/articles', {})}
			class="link mt-1 flex items-center gap-2 self-center text-sm font-bold"
			><Search class="icon" />Browse More Articles</a
		>
	{/if}
</div>

<style>
	.welcome {
		text-align: center;
	}

	.articles {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		width: 100%;
		gap: calc(var(--spacing) * 5);
	}

	.articles .card {
		max-width: calc(33.333% - var(--spacing) * 5);
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
