<script lang="ts">
	import InfoIcon from '@lucide/svelte/icons/info';

	import Fr from 'svelte-flag-icons/Fr.svelte';
	import Gb from 'svelte-flag-icons/Gb.svelte';

	import { page } from '$app/state';

	import Link from '$lib/components/Link.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { defaultLocale } from '$lib/lang.js';

	let currentLocale = $derived(page.params.locale ?? defaultLocale);
	let nextLocale = $derived(currentLocale === 'en' ? 'fr' : '');
	let args = $derived({ ...page.params, locale: nextLocale });
</script>

<Tooltip.Provider delayDuration={200}>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Link href={page.url.search} preloadData="tap" bind:args>
				{#if currentLocale === 'en'}
					<Gb />
				{:else}
					<Fr />
				{/if}
			</Link>
		</Tooltip.Trigger>
		<Tooltip.Content side="bottom" class="rounded-2xl bg-muted-foreground text-center">
			Tap to change language
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
