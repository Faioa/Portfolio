<script lang="ts">
	import { toggleMode } from "mode-watcher";
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import { Button } from '$lib/components/ui/button';

	let { height = "100%" } = $props();
</script>

<Button onclick={toggleMode} variant="ghost" size="icon" class="rounded-full">
	<SunIcon
		size={height} class="rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
	/>
	<MoonIcon
		size={height} class="absolute rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>