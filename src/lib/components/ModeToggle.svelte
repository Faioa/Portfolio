<script lang="ts">
	import { mode, setMode } from "mode-watcher";
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import { Button } from '$lib/components/ui/button';

	let { height = "100%" } = $props();


	async function toggleMode(event: MouseEvent) {
		const newMode = mode.current === 'light' ? 'dark' : 'light';

		// Fallback
		if (!document.startViewTransition) {
			setMode(newMode);
			return;
		}

		const { clientX: x, clientY: y } = event;
		const xPercent = (x / window.innerWidth) * 100;
		const yPercent = (y / window.innerHeight) * 100;

		document.documentElement.style.setProperty('--x', `${xPercent}%`);
		document.documentElement.style.setProperty('--y', `${yPercent}%`);

		await document.startViewTransition(() => {
			setMode(newMode);
		}).updateCallbackDone.catch(() => {});
	}
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

<style>
    :global(::view-transition-old(root)),
    :global(::view-transition-new(root)) {
        animation: none;
        mix-blend-mode: normal;
    }

    :global(::view-transition-new(root)) {
        animation: reveal 1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes reveal {
        from {
            clip-path: circle(0% at var(--x, 50%) var(--y, 50%));
        }
        to {
            clip-path: circle(150% at var(--x, 50%) var(--y, 50%));
        }
    }
</style>