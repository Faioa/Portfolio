<script lang="ts">
	import ListMusicIcon from '@lucide/svelte/icons/list-music';

	import { onMount } from 'svelte';

	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';

	import LangChanger from '$lib/components/LangChanger.svelte';
	import Link from '$lib/components/Link.svelte';
	import ModeToggle from '$lib/components/ModeToggle.svelte';
	import NavMenu from '$lib/components/NavMenu.svelte';
	import Logo from '$lib/components/icons/Logo.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Separator } from '$lib/components/ui/separator';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { cn } from '$lib/utils';

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();

	let isMobile = new IsMobile();
	let mounted = $state(false);

	let isOpen = $state(false);

	onMount(() => {
		mounted = true;
	});

	// Dialog closes after navigating to another page
	afterNavigate((navigation) => {
		if (!navigation.from || !navigation.to || navigation.from.url.href !== navigation.to.url.href) isOpen = false;
	});

	let ref = $state<HTMLElement | null>(null);
</script>

{#if mounted || !browser}
	<header class={cn('h-[75px] max-h-[75px] w-full px-5 md:px-10', className)}>
		<div class="relative flex h-full w-full flex-col items-center justify-center gap-3">
			<!-- No JS warning -->
			<noscript class="absolute top-0 w-full text-center text-xs text-destructive md:text-sm">
				Please activate Javascript to fully use this website.
			</noscript>

			<div class="relative grid h-full w-full grid-cols-3 items-center">
				<div class="col-span-1 flex items-center justify-start">
					<Link href="/"><Logo class="icon size-10 md:size-15" /></Link>
				</div>

				<div class="col-span-1 flex items-center justify-center">
					{#if mounted && !isMobile.current}
						<NavMenu />
					{:else}
						<!-- Empty div to keep grid layout -->
						<div></div>
					{/if}
				</div>

				<div class="col-span-1 flex items-center justify-end gap-3">
					<Dialog.Root bind:open={isOpen}>
						<Dialog.Trigger type="button" class="aspect-square rounded-full md:pointer-events-none md:hidden">
							<ListMusicIcon class="icon size-8" />
						</Dialog.Trigger>
						<Dialog.Content
							bind:ref
							showCloseButton={false}
							onOpenAutoFocus={(e) => {
								e.preventDefault();
								const el: HTMLElement | undefined | null = ref?.querySelector('[data-active]');
								el?.focus();
							}}
							class="flex h-1/2 w-3/5 flex-col items-center justify-center text-center"
						>
							<Dialog.Description
								>You can use this menu to navigate to the main pages of the website.</Dialog.Description
							>
							<NavMenu orientation="vertical" />
						</Dialog.Content>
					</Dialog.Root>
					<LangChanger />
					<ModeToggle />
				</div>
			</div>
		</div>
		<Separator class="w-full" />
	</header>
{/if}
