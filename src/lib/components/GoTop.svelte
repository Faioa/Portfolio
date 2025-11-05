<script lang="ts">
	import CircleArrowUp from "@lucide/svelte/icons/circle-arrow-up";
	import { onMount } from "svelte";

	let scrollY = $state(0)
	let minHeight = $state(100);

	function toTop() {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	onMount(() => {
		minHeight = window.innerHeight / 2;
	})
</script>

<svelte:window bind:scrollY />
<CircleArrowUp class="link fixed bottom-10 right-10 z-10 size-9 duration-200 {scrollY > minHeight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} cursor-pointer" onclick={toTop} />
