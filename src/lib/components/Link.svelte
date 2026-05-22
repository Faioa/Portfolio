<script lang="ts">
	import type { Snippet } from 'svelte';

	import { browser, building } from '$app/environment';
	import { page } from '$app/state';

	import { defaultLocale, getUrl, locales, urlIsExternal } from '$lib/lang';
	import { cn } from '$lib/utils';

	interface LinkProps extends svelteHTML.HTMLAttributes<HTMLAnchorElement> {
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
		href,
		args = {},
		class: className = '',
		preloadData = 'hover',
		preloadCode = 'hover',
		reload = false,
		replaceState = false,
		keepFocus = false,
		noScroll = false,
		children,
		...restProps
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

	let locale = $derived.by(() => {
		let l = browser || building ? page.params.locale : defaultLocale;
		if (browser || building) {
			const pathname = page.url.pathname;
			if (pathname.length > 1 && pathname.startsWith('/')) {
				const tmp = pathname.split('/')[1];
				if (locales.includes(tmp)) l = tmp;
			}
		}
		return l;
	});

	let isExternal = $derived(urlIsExternal(href?.trim() ?? page.url.pathname, page.url.origin));
	let params = $derived({ ...page.params, locale, ...args });
	let hash = $derived(browser && !href ? window.location.hash : '');
	let search = $derived(browser && !href ? page.url.search : '');
	let url = $derived(getUrl(href?.trim() ?? '', isExternal, { id: page.route.id, params, search, hash }));
</script>

<a
	href={url}
	target={isExternal ? '_blank' : undefined}
	class={cn('clickable', className)}
	{...dataAttributes}
	{...restProps}
>
	{@render children?.()}
</a>

<style>
</style>
