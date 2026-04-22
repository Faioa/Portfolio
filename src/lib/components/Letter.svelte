<script lang="ts">
	import type { Snippet } from 'svelte';

	import { cn } from '$lib/utils';

	interface Props {
		backColor?: string;
		frontColor?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		backColor = 'fill-secondary',
		frontColor = 'fill-background',
		class: className = '',
		children
	}: Props = $props();

	let rotate: boolean = $state(false);
</script>

<div class={cn('relative h-[21.299999mm] w-[27.828751mm]', className)}>
	<svg
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

	<div class="relative z-0 overflow-hidden p-5">
		{@render children?.()}
	</div>

	<svg
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
		viewBox="0 0 21.299999 27.828751"
		xmlns="http://www.w3.org/2000/svg"
		preserveAspectRatio="none"
		class="absolute inset-0 h-full max-h-100 w-full md:max-h-max {rotate ? 'z-20' : '-z-10'}"
	>
		<g transform="translate(-94.350003,-129.3227)">
			<path
				id="letter-cover"
				class="inline {frontColor} stroke-current"
				style="stroke-width:0.297191;stroke-linejoin:bevel;stroke-miterlimit:20;stroke-dasharray:none;stroke-opacity:1"
				d="m 95.349308,140.05792 9.690902,-10.58333 9.6909,10.58333 Z"
				transform="translate(0,0.05119014)"
			/>
		</g>
	</svg>
</div>
