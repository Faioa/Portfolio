<script lang="ts">
	import { page } from '$app/state';

	import Link from '$lib/components/Link.svelte';

	const messages: Record<number, { error: string; message: string }> = {
		404: {
			error: 'Page Not Found',
			message: 'The page you are looking for does not exist. Please verify your request and try again.'
		},
		403: {
			error: 'Forbidden',
			message:
				'You do not have permission to access this page. Please contact the site administrator if you believe this is an error.'
		},
		408: {
			error: 'Request Timeout',
			message: 'The server took too long to respond. Please try again in a few minutes.'
		},
		429: {
			error: 'Too Many Requests',
			message: 'You have made too many requests. Please try again later.'
		},
		500: {
			error: 'Internal Server Error',
			message: 'Something went wrong. Please wait a few minutes and try again.'
		}
	};
</script>

<div class="flex flex-col items-center justify-center gap-10 text-center">
	<div class="flex flex-col items-center justify-center gap-2">
		<span class="!text-4xl font-bold md:!text-5xl">{page.status}</span>
		<span class="!text-2xl md:!text-3xl">{messages[page.status]?.error}</span>
	</div>
	<span class="!text-lg">{messages[page.status]?.message}</span>
	<div class="flex items-center justify-center gap-10">
		<Link href="/" class="rounded-2xl bg-secondary px-5 py-2 !text-lg shadow shadow-primary hover:opacity-70">Home</Link
		>
		{#if page.route.id?.startsWith('/[[locale=lang]]/articles/[article]')}
			<Link href="/articles" class="rounded-2xl bg-secondary px-5 py-2 !text-lg shadow shadow-primary hover:opacity-70"
				>Articles</Link
			>
		{/if}
	</div>
</div>
