<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<div class="container">
	<h2 class="title">My Projects</h2>
	<p>
		This page showcases the projects I'm most proud of. More content will be added over time. You
		can find out more about each project on their respective page. For instance, you will find
		information about my motivations and goals, as well as a roadmap of the features (<span
			class="text-destructive">which is still a work in progress</span
		>). Please feel free to give me your feedback. Thank you!
	</p>
	<div class="my-10 grid grid-cols-2 gap-10">
		<div class="card">
			<h2 class="subtitle">Flux Studio</h2>
			<p>
				Flux studio is a soon-to-be developed <span class="font-bold"
					>Digital Audio Workstation</span
				>
				using <span class="font-bold italic">Rust</span>. My aim is to create a top-notch DAW that
				can be used for playing and learning music. My goals are ambitious, but I will do my best to
				see this project through nonetheless.
			</p>
			<a href={resolve('/projects/flux-studio')} class="link mt-3 self-end justify-self-end text-sm"
				>Read More</a
			>
		</div>

		<div class="card flex flex-col gap-2">
			<h2 class="subtitle">This Website</h2>
			<p>
				This website is both a portfolio and a blog developed with <span class="font-bold italic"
					>Svelte</span
				>
				and <span class="font-bold italic">SvelteKit</span>. I will post updates on my projects and
				experiences, as well as anything else I find interesting. It is also a way for you to
				contact me. This project is an opportunity for me to experiment with web development.
			</p>
			<a href={resolve('/projects/website')} class="link mt-3 self-end justify-self-end text-sm"
				>Read More</a
			>
		</div>
	</div>
</div>
