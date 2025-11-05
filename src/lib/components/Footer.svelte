<script lang="ts">
	import Linkedin from "@lucide/svelte/icons/linkedin";
	import Github from "@lucide/svelte/icons/github";
	import Mail from "@lucide/svelte/icons/mail";
	import Scale from "@lucide/svelte/icons/scale";

	const height = 100;
</script>

<footer style="--height: {height}px;">
	<div class="grid grid-cols-2 gap-x-5 gap-y-2 text-base">
		<a href="https://www.linkedin.com/in/matthieu-dartois/" target="_blank" class="contact link"><Linkedin class="icon" />LinkedIn</a>
		<a href="https://github.com/Faioa" target="_blank" class="contact link"><Github class="icon" />GitHub</a>
		<a href="/contact" class="contact link col-span-2"><Mail class="icon" />Contact Me</a>
		<a href="/legal-notices" class="contact link col-span-2 text-sm underline"><Scale class="icon" />Legal Notices<Scale class="icon" /></a>
	</div>
</footer>

<style>
    footer {
        display: flex;
        align-items: center;
        justify-content: space-around;
        line-height: 1;
        height: var(--height);
        width: 100%;
        padding-left: calc(var(--spacing) * 5);
        padding-right: calc(var(--spacing) * 5);
    }

		.contact {
				display: flex;
				align-items: center;
				justify-content: center;
        gap: calc(var(--spacing) * 2);
		}
</style>