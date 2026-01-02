<script lang="ts">
	import type { Snippet } from 'svelte';

	import { resolve } from '$app/paths';
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
		href = $bindable(''),
		args = $bindable({}),
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

	// If component is rendered, this route exists, so id cannot be null in this context
	// page.route.id is used instead of page.url.pathname because it leaves the possibility to override the params with args
	let url = $derived(getUrl(href, isExternal, page.route.id!, page.params.locale));
</script>

<a
	{...dataAttributes}
	class="link {className}"
	target={isExternal ? '_blank' : '_self'}
	href={isExternal ? href : resolve(url, { ...page.params, ...args })}
>
	{@render children?.()}
</a>

<style>
</style>
