<script lang="ts">
	import type { Snippet } from 'svelte';
	import { expoInOut } from 'svelte/easing';
	import { type FlyParams, type TransitionConfig, fly, scale } from 'svelte/transition';

	import { cn } from '$lib/utils';

	/**
	 * An interface representing properties for the Letter component.
	 *
	 * @interface Props
	 *
	 * @property {boolean} [animate=false] - Determines if the component should have animations enabled.
	 * @property {boolean} [close=false] - Indicates whether the component should close. **Bindable**.
	 * @property {string} [closedMessage=''] - A message to display when the component is closed.
	 * @property {string} [backColor='fill-secondary'] - CSS class used to specify the color for the component's back.
	 * @property {string} [frontColor='fill-background'] - CSS class used to specify the color for the component's front, including the cover.
	 * @property {string} [pageColor='bg-background'] - CSS class used to specify the page color for the content of the letter. There will be no background if this property is not set or invalid.
	 * @property {string} [class=''] - Additional CSS class to style the component.
	 * @property {Snippet} [children=undefined] - Represents child elements within the component.
	 */
	interface Props {
		animate?: boolean;
		close?: boolean;
		closedMessage?: string;
		backColor?: string;
		frontColor?: string;
		pageColor?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		animate = false,
		close = $bindable(false),
		closedMessage = '',
		backColor = 'fill-secondary',
		frontColor = 'fill-background',
		pageColor = 'bg-background',
		class: className = '',
		children
	}: Props = $props();

	let closed: boolean = $state(false);
	let fold: boolean = $state(false);

	/**
	 *
	 * Custom transition for the fly effect with default values used in this component.
	 *
	 * @param {Element} node - The DOM element to transition.
	 * @param {FlyParams} params - Additional parameters for the fly effect to override the default values.
	 */
	function customFly(node: Element, params: FlyParams = {}): TransitionConfig {
		if (!animate) {
			return {
				duration: 0,
				css: () => ''
			};
		}

		return fly(node, { duration: 1000, easing: expoInOut, y: 200, ...params });
	}

	$effect(() => {
		if (close) {
			fold = true;
			const timer = setTimeout(() => {
				closed = true;
			}, 1000);
			return () => clearTimeout(timer);
		} else {
			closed = false;
			const timer = setTimeout(() => {
				fold = false;
			}, 250);
			return () => clearTimeout(timer);
		}
	});
</script>

<div class={cn('relative h-[21.299999mm] w-[27.828751mm] overflow-hidden', className)}>
	{#if fold}
		<svg
			transition:customFly
			viewBox="0 0 21.299999 27.828751"
			xmlns="http://www.w3.org/2000/svg"
			preserveAspectRatio="none"
			class="absolute inset-0 -z-10 h-full max-h-100 w-full md:max-h-max"
		>
			<path
				id="letter-back"
				class="inline {backColor} stroke-current"
				style="stroke-width:0.3;stroke-linejoin:bevel;stroke-miterlimit:20;stroke-dasharray:none"
				transform="translate(-94.350003,-129.3227)"
				d="m 95.822917,140 h 18.354163 a 1.3229166,1.3229166 45 0 1 1.32292,1.32292 v 14.35416 A 1.3229166,1.3229166 135 0 1 114.17708,157 H 95.822917 A 1.3229166,1.3229166 45 0 1 94.5,155.67708 V 141.32292 A 1.3229166,1.3229166 135 0 1 95.822917,140 Z"
			/>
		</svg>
	{/if}

	{#if animate && closed}
		<div
			transition:scale={{ delay: closed ? 250 : 0, duration: 500 }}
			class="absolute top-[10%] z-50 text-center font-bold"
		>
			{closedMessage}
		</div>
	{/if}

	<div
		class="relative z-0 overflow-hidden {animate && fold
			? 'scale-y-45 duration-250 md:scale-y-100'
			: ' delay-500 duration-1000'}"
	>
		<div
			class="rounded {pageColor ?? ''} h-full w-full p-5 duration-1000 {animate && fold
				? '-translate-y-1/6 delay-250 md:translate-y-2/5'
				: 'delay-400'}"
		>
			{@render children?.()}
		</div>
	</div>

	{#if fold}
		<svg
			transition:customFly
			viewBox="0 0 21.299999 27.828751"
			xmlns="http://www.w3.org/2000/svg"
			preserveAspectRatio="none"
			class="absolute inset-0 z-20 h-full max-h-100 w-full md:max-h-max"
		>
			<path
				id="letter-front"
				class="inline {frontColor} stroke-current"
				style="stroke-width:0.3;stroke-linejoin:bevel;stroke-miterlimit:20;stroke-dasharray:none"
				transform="translate(-94.350003,-129.3227)"
				d="m 95.342298,140.09717 9.353672,6.25283 10.07753,-6.20538 c 0.15474,0.0679 0.69314,0.42484 0.7265,1.1783 v 14.35416 C 115.5,156.40771 114.90771,157 114.17708,157 H 95.822917 C 95.092289,157 94.499998,156.40771 94.5,155.67708 v -14.35416 c -2e-6,-0.73063 0.487026,-1.1137 0.842298,-1.22575 Z"
			/>
		</svg>

		<svg
			transition:customFly
			viewBox="0 0 21.299999 27.828751"
			xmlns="http://www.w3.org/2000/svg"
			preserveAspectRatio="none"
			class="absolute inset-0 h-full max-h-100 w-full md:max-h-max {closed ? 'z-20' : '-z-10'}"
		>
			<g class="duration-500" style="transform-origin: 10.6px 10.77px; transform: rotateX({closed ? 180 : 0}deg);">
				<path
					id="letter-cover"
					class="inline {frontColor} stroke-current"
					style="stroke-width:0.297191;stroke-linejoin:bevel;stroke-miterlimit:20;stroke-dasharray:none;stroke-opacity:1"
					d="m 95.349308,140.05792 9.690902,-10.58333 9.6909,10.58333 Z"
					transform="translate(-94.350003,-129.3227)"
				/>
			</g>
		</svg>
	{/if}
</div>
