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

	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	let items: RoadmapItem[] = [
		{ name: '2024', date: '2024', description: '2024', status: CANCELLED },
		{ name: '2024', date: '2024', description: '2024', status: ONGOING },
		{ name: '2024', date: '2024', description: '2024', status: COMPLETED },
		{ name: '2024', date: '2024', description: '2024', status: CANCELLED },
		{ name: '2024', date: '2024', description: '2024', status: CANCELLED },
		{ name: '2024', date: '2024', description: '2024', status: CANCELLED }
	];

	// Imported from Tailwind config for consistency
	const md = defaultTheme.screens.md;

	let isMd = $state(false);

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

{#key isMd}
	<Carousel.Root
		orientation={isMd ? 'horizontal' : 'vertical'}
		class="carousel my-10"
		opts={{
			align: 'start',
			slidesToScroll: 2,
			skipSnaps: true
		}}
	>
		<Carousel.Content class="-ms-0 -mt-0 h-96 md:h-auto">
			{#if items.length === 0}
				<Carousel.Item>
					<span class="text-destructive">Nothing to display yet.</span>
				</Carousel.Item>
			{/if}

			{#each items as item, i (i)}
				<Carousel.Item class="basis-1/5 ps-0 pt-0 md:basis-1/4 flex">
					<div
						class="w-full grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:grid-cols-1 md:grid-rows-[1fr_auto_1fr]"
					>
						<!-- Top/Left: Name/Date -->
						<div class="no-select text-right md:text-center">
							{#if i % 2 === 0}
								<span class="text-xl font-semibold">{item.name}</span>
							{:else}
								<span class="text-muted-foreground">{item.date}</span>
							{/if}
						</div>

						<!-- Center: Lines + Dot -->
						<div class="flex h-full flex-col items-center md:flex-row">
							<!-- Top/Left half-line (connects to previous item) -->
							<div class="flex flex-1 items-center justify-center">
								{#if i !== 0}
									<div
										class="h-full w-0.5 transition-colors md:h-0.5 md:w-full {item.status === COMPLETED
											? 'bg-muted-foreground'
											: item.status === ONGOING
												? 'bg-muted-foreground/40'
												: 'bg-destructive'}"
									></div>
								{/if}
							</div>

							<!-- Dot -->
							<Tooltip.Provider delayDuration={500}>
								<Tooltip.Root>
									<Tooltip.Trigger class="carousel-content-trigger">
										<div
											class="size-5 shrink-0 rounded-full border-2 shadow transition-all {item.status ===
											COMPLETED
												? 'border-muted-foreground bg-muted-foreground/30'
												: item.status === ONGOING
													? 'border-muted-foreground/40 bg-muted'
													: 'border-destructive bg-destructive/30'}"
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
										</div>
									</Tooltip.Trigger>
									<Tooltip.Content side={isMd ? (i % 2 === 0 ? 'bottom' : 'top') : i % 2 === 0 ? 'right' : 'left'}>
										<p>{item.description}</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</Tooltip.Provider>

							<!-- Bottom/Right half-line (connects to next item) -->
							<div class="flex flex-1 items-center justify-center">
								{#if i !== items.length - 1}
									<div
										class="h-full w-0.5 transition-colors md:h-0.5 md:w-full {items[i + 1].status ===
										COMPLETED
											? 'bg-muted-foreground'
											: items[i + 1]?.status === ONGOING
												? 'bg-muted-foreground/40'
												: 'bg-destructive'}"
									></div>
								{/if}
							</div>
						</div>

						<!-- Bottom/Right: Date/Name -->
						<div class="no-select text-left md:text-center">
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

<style>
	:global(.carousel:active) {
		cursor: grabbing;
	}

	:global(.carousel) {
		cursor: grab;
	}

	:global(.carousel-content-trigger:hover) {
		opacity: 0.85;
		cursor: help;
	}
</style>
