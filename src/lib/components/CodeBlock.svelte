<script lang="ts">
	import Copy from '@lucide/svelte/icons/copy';
	import CopyCheck from '@lucide/svelte/icons/copy-check';

	import { browser } from '$app/environment';

	import { Button } from '$lib/components/ui/button';

	const {
		filename,
		lang,
		code,
		codeCopy,
		showLinesNumber = false
	}: {
		filename?: string;
		lang: string;
		code: string;
		codeCopy: string;
		showLinesNumber?: boolean;
	} = $props();

	let copied = $state.raw(false);

	let timeout: NodeJS.Timeout | null = null;
	async function copy() {
		if (!browser) return;

		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}

		// Copy with replace of special characters
		await navigator.clipboard.writeText(
			codeCopy
				.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
				.replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
				.replace(/&quot;/g, '"')
				.replace(/&apos;/g, "'")
				.replace(/&amp;/g, '&')
				.replace(/&lt;/g, '<')
				.replace(/&gt;/g, '>')
		);
		copied = true;
		timeout = setTimeout(() => {
			copied = false;
		}, 1000);
	}
</script>

<div class="code-block flex max-w-full flex-col gap-2 rounded-2xl bg-muted px-5 pt-2 pb-5">
	<div class="code-header flex flex-row-reverse items-center justify-between">
		<Button variant="ghost" class="z-1 rounded-xl text-sm" onclick={copy}>
			{#if !copied}
				<Copy class="icon" />
			{:else}
				<CopyCheck class="icon" /> Copied!
			{/if}
		</Button>

		{#if filename}
			<div class="filename text-sm text-muted-foreground">{filename}</div>
		{/if}
	</div>

	<hr class="text-muted-foreground" />

	<span class="language i pl-2 text-sm text-muted-foreground italic">{lang}</span>
	<div
		class="code-content grid max-h-100 overflow-scroll text-sm {showLinesNumber
			? 'showLinesNumber'
			: ''}"
	>
		{@html code}
	</div>
</div>

<style>
	/* Line counter init at 0 */
	.code-content {
		counter-reset: step;
		counter-increment: step 0;
	}

	/* Enlarging lines for background coloration compatible with x-axis-scroll */
	.code-content :global(.line) {
		display: inline-block;
		width: 100%;
	}

	/* Selection based on https://shiki.style/packages/transformers#transformernotationdiff */
	/* Creating start margin in case some lines have extra element (+/-) */
	.code-content :global(.has-diff .line::before) {
		width: 1rem;
		margin-right: 1.5rem;
		display: inline-block;
		text-align: right;
		content: '';
	}

	/* Removing the margin his the line has the extra element (+/-) */
	.code-content :global(.line.diff.remove::before),
	.code-content :global(.line.diff.add::before) {
		margin-right: 0 !important;
	}

	/* Changing the content of the empty element with the line counter */
	.showLinesNumber :global(.line::before) {
		content: counter(step) !important;
		counter-increment: step;
		color: var(--muted-background);
		opacity: 0.7;
		margin-right: 1.5rem;
	}

	/* Doesn't increase the counter if the line is a remove one */
	.showLinesNumber :global(.line.diff.remove::before) {
		counter-increment: none;
		opacity: 0;
	}

	/* Background color of removed lines */
	.code-content :global(.line.diff.remove) {
		background-color: var(--shiki-removed);
	}

	/* Background color of added lines */
	.code-content :global(.line.diff.add) {
		background-color: var(--shiki-added);
	}

	/* Adding - at the start of the removed lines */
	.code-content :global(.line.diff.remove span:first-child::before) {
		display: inline-block;
		width: 1rem;
		margin-right: 0.5rem;
		text-align: right;
		content: '-';
		color: var(--shiki-foreground);
	}

	/* Adding + at the start of the added lines */
	.code-content :global(.line.diff.add span:first-child::before) {
		display: inline-block;
		width: 1rem;
		text-align: right;
		margin-right: 0.5rem;
		content: '+';
		color: var(--shiki-foreground);
	}
</style>
