<script lang="ts">
	import FluxStudioTile from '$lib/components/FluxStudioTile.svelte';
	import WebsiteTile from '$lib/components/WebsiteTile.svelte';
</script>

<div class="container">
	<h2 class="title">My Projects</h2>
	<p>
		This page showcases some of my projects. More content will be added over time. You can find out more about each
		project on their respective page. For instance, you will find information about my motivations and goals, as well as
		a roadmap of the features. Please feel free to give me your feedback. Thank you!
	</p>
	<div class="my-10 grid grid-cols-1 gap-10 md:grid-cols-2">
		<FluxStudioTile />
		<WebsiteTile />
	</div>
</div>
