<script lang="ts">
	import Fr from 'svelte-flag-icons/Fr.svelte';
	import Gb from 'svelte-flag-icons/Gb.svelte';

	import { browser, building } from '$app/environment';
	import { page } from '$app/state';

	import Link from '$lib/components/Link.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { defaultLocale, locales } from '$lib/lang.js';

	let currentLocale = $derived.by(() => {
		if (!browser && !building) return defaultLocale;
		if (page.params.locale) return page.params.locale;
		// Additional check in case the URL is not correct (err 404)
		const pathname = page.url.pathname;
		if (pathname.length > 1 && pathname.startsWith('/')) {
			const tmp = pathname.split('/')[1];
			if (locales.includes(tmp)) return tmp;
		}
		return defaultLocale;
	});
	let args = $derived({ locale: currentLocale === 'en' ? 'fr' : 'en' });
</script>

<Tooltip.Provider delayDuration={200}>
	<Tooltip.Root>
		<Tooltip.Trigger class="clickable">
			<Link preloadData="tap" {args}>
				{#if currentLocale !== 'en'}
					<Gb />
				{:else}
					<Fr />
				{/if}
			</Link>
		</Tooltip.Trigger>
		<Tooltip.Content side="bottom" class="z-100 rounded-2xl bg-muted-foreground text-center">
			Tap to change language
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
