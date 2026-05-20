import defaultTheme from 'tailwindcss/defaultTheme';

import { MediaQuery } from 'svelte/reactivity';

// Imported from Tailwind config for consistency, '768px' by default
const DEFAULT_MOBILE_BREAKPOINT = defaultTheme.screens.md;

export class IsMobile extends MediaQuery {
	constructor(breakpoint: string = DEFAULT_MOBILE_BREAKPOINT) {
		super(`not all and (min-width: ${breakpoint})`);
	}
}
