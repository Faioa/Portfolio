<script lang="ts">
	import Link from '$lib/components/Link.svelte';

	import { page } from '$app/state';

	const messages: Record<number, { error: string; message: string }> = {
		404: {
			error: "Page Not Found",
			message: "The page you are looking for does not exist. Please verify your request and try again."
		},
		403: {
			error: "Forbidden",
			message: "You do not have permission to access this page. Please contact the site administrator if you believe this is an error."
		},
		408: {
			error: "Request Timeout",
			message: "The server took too long to respond. Please try again in a few minutes."
		},
		429: {
			error: "Too Many Requests",
			message: "You have made too many requests. Please try again later."
		},
		500: {
			error: "Internal Server Error",
			message: "Something went wrong. Please wait a few minutes and try again."
		}
	}
</script>

<div class="flex-col text-center items-center justify-center">
	<div>
		{page.status} - {messages[page.status]?.error}
	</div>

	<div>{messages[page.status]?.message}</div>
</div>
