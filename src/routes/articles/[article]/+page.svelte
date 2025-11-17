<script lang="ts">
	const { data } = $props();

	const { id, content: Content, metadata } = data.article;
</script>

<div class="container">
	<Content/>
</div>