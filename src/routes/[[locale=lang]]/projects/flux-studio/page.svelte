<script lang="ts">
	import RoadMap, { ONGOING, type RoadmapItem } from '$lib/components/RoadMap.svelte';

	const items: RoadmapItem[] = [
		{
			name: "Project's Start",
			date: 'Apr 2026',
			status: ONGOING,
			description:
				'The official start of the project is to learn Rust again and experiment with audio processing libraries.'
		},
		{
			name: 'Architecture',
			date: 'May 2026',
			status: ONGOING,
			description:
				'After a month of testing, I should have designed a suitable architecture for the project. It will certainly change, but this should provide a solid foundation.'
		},
		{
			name: 'GUI',
			date: 'Mid-May 2026',
			status: ONGOING,
			description:
				'Once the architecture and main objectives have been defined, I should be able to start working on the GUI. Which library should I use? What default styling should I apply?'
		},
		{
			name: 'Next',
			date: 'Unknown',
			status: ONGOING,
			description: 'I will consider the next steps once I have reached the initial stages of this project.'
		}
	];
</script>

<article class="container text-justify">
	<h1 class="title">Flux Studio</h1>

	<section>
		<h2 class="subtitle">Main goals</h2>
	</section>

	<section>
		<h2 class="subtitle">Expected difficulties</h2>
	</section>

	<section>
		<h2 class="subtitle">Roadmap</h2>
		<RoadMap {items} />
	</section>
</article>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: calc(var(--spacing) * 5);
		margin-top: 30px;
	}
</style>
