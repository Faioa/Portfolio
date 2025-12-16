<script lang="ts">
	import { resolve } from '$app/paths';

	import WorkInProgress from '$lib/components/WorkInProgress.svelte';
</script>

<article class="container text-justify">
	<h1 class="title">This Website</h1>
	<p>
		This website is my way of justifying taking a year off from university. If you're not sure what
		I mean, you can find out more on <a href={resolve('/about')} class="link">this page</a>. It is
		also a way for me to keep track of my activities, projects, and associated goals. I think it
		could be useful for business partners or recruiters who want to find out more about a candidate
		before making an offer. If you are interested in this, I am definitely the person for the job -
		don't hesitate to contact me! More seriously, I will develop this website in my free time to
		promote myself and my projects.
	</p>
	<p class="w-full">The content of this page is bound to change as the project progresses.</p>

	<section>
		<h2 class="subtitle">Svelte and SvelteKit</h2>
		<p>
			I was curious about learning how to use a web development framework, so this is also the
			perfect opportunity to make something with the ones I had in mind: Svelte and SvelteKit. I've
			heard a lot of good things about them, so I thought I'd give them a try, and I have to say, I
			was impressed. Even though I didn't have much experience with Javascript or HTML/CSS, they
			made it really easy to build something decent. I'll probably write an article about it later,
			when I'm a bit more experienced and confident in explaining things, but I encourage you to
			check <a href="https://svelte.dev" class="link">their website</a> for more details.
		</p>
	</section>

	<section>
		<h2 class="subtitle">Main Milestones</h2>
		<p>
			My first goal is to create a fully functional application comprising all its pages, error
			handling and efficient back-end logic. Then, I will try to make the entire application
			responsive. Finally, I will add quality-of-life features such as multiple language support and
			a more efficient UI. Once all of this has been achieved, I will update the style periodically
			(perhaps with seasonal themes) and add content in the form of articles and projects. I
			envision the articles feature as interactive: the main point is to share my knowledge and
			experiences and showcase my hobbies, but most importantly, to learn from your feedback and
			constantly improve.
		</p>
	</section>

	<section>
		<h2 class="subtitle">Roadmap</h2>
		<WorkInProgress />
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

	.link {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
</style>
