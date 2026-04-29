<script lang="ts">
	import GitHub from "$lib/components/icons/GitHub.svelte";
	import LinkedIn from '$lib/components/icons/LinkedIn.svelte';
	import Mail from '@lucide/svelte/icons/mail';
	import Scale from '@lucide/svelte/icons/scale';

	import Link from '$lib/components/Link.svelte';

	const height = 100;
</script>

<footer id="footer" style="--height: {height}px;">
	<div class="grid grid-cols-2 gap-x-5 gap-y-2 text-base">
		<Link href="https://www.linkedin.com/in/matthieu-dartois/" class="contact">
			<LinkedIn class="size-5 rounded"/>LinkedIn
		</Link>
		<Link href="https://github.com/Faioa" class="contact">
			<GitHub class="size-5" />GitHub
		</Link>
		<Link href="/contact" class="contact col-span-2">
			<Mail class="size-5" />Contact Me
		</Link>
		<Link href="/legal-notices" class="contact col-span-2 text-sm underline underline-offset-2">
			<Scale class="icon" />Legal Notices<Scale class="icon" />
		</Link>
	</div>
</footer>

<style>
	footer {
		display: flex;
		align-items: center;
		justify-content: space-around;
		line-height: 1;
		height: var(--height);
		width: 100%;
		padding-left: calc(var(--spacing) * 5);
		padding-right: calc(var(--spacing) * 5);
		margin-top: calc(var(--spacing) * 10);
	}

	:global(.contact) {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: calc(var(--spacing) * 2);
	}
</style>