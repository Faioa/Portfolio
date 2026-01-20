<script lang="ts">
	import type { Snippet } from 'svelte';

	import { browser } from '$app/environment';
	import { page } from '$app/state';

	import { getUrl, urlIsExternal } from '$lib/lang';

	interface LinkProps {
		href?: string;
		args?: Record<string, string>;
		class?: string;
		preloadData?: 'hover' | 'tap' | 'off';
		preloadCode?: 'eager' | 'viewport' | 'hover' | 'tap' | 'off';
		reload?: boolean;
		replaceState?: boolean;
		keepFocus?: boolean;
		noScroll?: boolean;
		children?: Snippet;
	}

	const {
		href = '',
		args = {},
		class: className = '',
		preloadData = 'hover',
		preloadCode = 'hover',
		reload = false,
		replaceState = false,
		keepFocus = false,
		noScroll = false,
		children
	}: LinkProps = $props();

	let dataAttributes = $derived.by(() => {
		const attrs: Record<string, string> = {};

		if (preloadData !== 'off') {
			attrs['data-sveltekit-preload-data'] = preloadData;
		}
		if (preloadCode !== 'off') {
			attrs['data-sveltekit-preload-code'] = preloadCode;
		}
		if (reload) {
			attrs['data-sveltekit-reload'] = '';
		}
		if (replaceState) {
			attrs['data-sveltekit-replacestate'] = '';
		}
		if (keepFocus) {
			attrs['data-sveltekit-keepfocus'] = '';
		}
		if (noScroll) {
			attrs['data-sveltekit-noscroll'] = '';
		}

		return attrs;
	});

	let isExternal = $derived(urlIsExternal(href, page.url.origin));

	let params = $derived({ ...page.params, ...args });

	let search = $derived(href.length !== 0 ? (args.search ?? '') : browser ? page.url.search : '');
	let hash = $derived(href.length !== 0 ? (args.hash ?? '') : browser ? page.url.hash : '');

	// page.route.id is used instead of page.url.pathname because it leaves the possibility to override the route params
	let url = $derived(getUrl(href, isExternal, { id: page.route.id, params, search, hash }));
</script>

<a {...dataAttributes} class="link {className}" target={isExternal ? '_blank' : '_self'} href={url}>
	{@render children?.()}
</a>

<style>
</style>
