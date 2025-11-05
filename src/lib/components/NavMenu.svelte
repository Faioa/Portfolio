<script lang="ts">
	import ListMusic from '@lucide/svelte/icons/list-music';
	import { Button } from "$lib/components/ui/button/index.js"

	const { height = "100%" } = $props();
</script>

<nav class="inline-block relative h-full z-10">
	<ListMusic size={height} class="p-5" />

	<div class="content">
		<div class="flex flex-col gap-2">
			<Button href="/articles" variant="ghost">Articles</Button>
			<hr />
			<Button href="/contact" variant="ghost">Contact</Button>
			<hr />
			<Button href="/projects" variant="ghost">Projects</Button>
		</div>
	</div>
</nav>

<style>
	nav .content {
		display: none;
	}

	nav:hover .content {
      display: block;
			position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%) translateY(100%);
	}
</style>