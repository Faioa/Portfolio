<script lang="ts" module>
	export const COMPLETED = 1;
	export const ONGOING = 0;
	export const CANCELLED = -1;

	export type Status = typeof COMPLETED | typeof ONGOING | typeof CANCELLED;

	export interface RoadmapItem {
		name: string;
		date: string;
		description: string;
		status: Status;
	}
</script>

<script lang="ts">
	import CheckCheckIcon from '@lucide/svelte/icons/check-check';
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import EllipsisVerticalIcon from '@lucide/svelte/icons/ellipsis-vertical';
	import XIcon from '@lucide/svelte/icons/x';
	import defaultTheme from 'tailwindcss/defaultTheme';

	import { onMount } from 'svelte';

	import { browser } from '$app/environment';

	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	interface Props {
		items?: RoadmapItem[];
	}

	let { items = [] }: Props = $props();

	// svelte-ignore state_referenced_locally
	let itemsRef: HTMLElement[] = $state(Array.from({ length: items.length }, () => null!));

	// Imported from Tailwind config for consistency
	const md = defaultTheme.screens.md;

	let isMd = $state(false);

	let carouselApi = $state<CarouselAPI | undefined>();

	function handleWheel(event: WheelEvent) {
		if (!carouselApi) return;

		const isHorizontal = event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY);

		const delta = isHorizontal ? event.deltaX : event.deltaY;
		const sensibilityThreshold = 10;

		if (Math.abs(delta) < sensibilityThreshold) return;

		if (delta > 0 && carouselApi.canScrollNext()) {
			event.preventDefault();
			carouselApi.scrollNext();
		} else if (delta < 0 && carouselApi.canScrollPrev()) {
			event.preventDefault();
			carouselApi.scrollPrev();
		}
	}

	onMount(() => {
		const mediaQuery = window.matchMedia('(min-width: ' + md + ')');
		isMd = mediaQuery.matches;

		const handler = (e: MediaQueryListEvent) => {
			isMd = e.matches;
		};
		mediaQuery.addEventListener('change', handler);
		return () => mediaQuery.removeEventListener('change', handler);
	});
</script>

{#if browser}
	{#key isMd}
		<Carousel.Root
			orientation={isMd ? 'horizontal' : 'vertical'}
			class="my-10 md:my-0"
			onwheel={handleWheel}
			opts={{
				align: 'start',
				axis: isMd ? 'x' : 'y',
				slidesToScroll: 2,
				skipSnaps: true,
				watchDrag: false
			}}
			setApi={(api) => (carouselApi = api)}
		>
			<Carousel.Content class="-ms-0 -mt-0 h-96 w-auto md:h-auto md:w-200">
				{#if items.length === 0}
					<Carousel.Item class="flex basis-[100%] items-center justify-center ps-0 pt-0">
						<span class="text-destructive">Nothing to display yet.</span>
					</Carousel.Item>
				{/if}

				{#each items as item, i (i)}
					<Carousel.Item
						bind:ref={itemsRef[i]}
						class="relative flex h-full w-full items-center justify-center ps-0 pt-0"
						style="flex-basis: {isMd
							? items.length < 5
								? 100 / items.length
								: 100 / 5
							: items.length < 4
								? 100 / items.length
								: 100 / 4}%"
					>
						<div
							class="grid h-full w-full grid-cols-[1fr_auto_1fr] items-center gap-4 md:grid-cols-1 md:grid-rows-[1fr_auto_1fr]"
						>
							<!-- Top/Left: Name/Date -->
							<div class="no-select truncate text-right md:text-center">
								{#if i % 2 === 0}
									<span class="text-xl font-semibold">{item.name}</span>
								{:else}
									<span class="text-muted-foreground">{item.date}</span>
								{/if}
							</div>

							<!-- Center: Lines + Dot -->
							<div class="flex h-full flex-col items-center md:flex-row">
								<!-- Top/Left half-line (connects to previous item) -->
								{#if i !== 0}
									<div class="flex flex-1 items-center justify-center">
										<div
											class="h-full w-0.5 transition-colors md:h-0.5 md:w-full {item.status === COMPLETED
												? 'bg-muted-foreground'
												: item.status === ONGOING
													? 'bg-muted-foreground/40'
													: 'bg-destructive'}"
										></div>
									</div>
								{/if}

								<!-- Dot -->
								<Popover.Root>
									<Popover.Trigger
										class="{buttonVariants({
											variant: 'outline',
											size: 'icon'
										})} carousel-content-trigger size-5 rounded-full border-2 {item.status === COMPLETED
											? 'border-muted-foreground bg-muted-foreground/30'
											: item.status === ONGOING
												? 'border-muted-foreground/40 bg-muted'
												: 'border-destructive bg-destructive/30'}
										{i === 0 ? (isMd ? 'ml-5' : 'mt-5') : i === items.length - 1 ? (isMd ? 'mr-5' : 'mb-5') : ''}"
										openOnHover={true}
										openDelay={500}
									>
										{#if item.status === COMPLETED}
											<CheckCheckIcon class="size-full p-0.5" />
										{:else if item.status === ONGOING}
											{#if isMd}
												<EllipsisIcon class="size-full p-0.5" />
											{:else}
												<EllipsisVerticalIcon class="size-full p-0.5" />
											{/if}
										{:else}
											<XIcon class="size-full p-0.5" />
										{/if}
									</Popover.Trigger>

									<Popover.Content
										class="max-h-25 max-w-100 overflow-auto text-center text-sm {isMd ? '' : 'translate-y-[100%]'}"
										customAnchor={isMd ? null : itemsRef[i]}
										side={isMd ? (i % 2 === 0 ? 'bottom' : 'top') : 'top'}
										align="center"
									>
										<p>{item.description}</p>
									</Popover.Content>
								</Popover.Root>

								<!-- Bottom/Right half-line (connects to next item) -->
								{#if i !== items.length - 1}
									<div class="flex flex-1 items-center justify-center">
										<div
											class="h-full w-0.5 transition-colors md:h-0.5 md:w-full {items[i + 1].status === COMPLETED
												? 'bg-muted-foreground'
												: items[i + 1]?.status === ONGOING
													? 'bg-muted-foreground/40'
													: 'bg-destructive'}"
										></div>
									</div>
								{/if}
							</div>

							<!-- Bottom/Right: Date/Name -->
							<div class="no-select truncate text-left md:text-center">
								{#if i % 2 === 1}
									<span class="text-xl font-semibold">{item.name}</span>
								{:else}
									<span class="text-muted-foreground">{item.date}</span>
								{/if}
							</div>
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
	{/key}
{/if}

<style>
	:global(.carousel-content-trigger:hover) {
		opacity: 0.75;
		cursor: help;
	}
</style>
