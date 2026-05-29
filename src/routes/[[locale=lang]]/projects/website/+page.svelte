<script lang="ts">
	import { resolve } from '$app/paths';

	import Link from '$lib/components/Link.svelte';
	import RoadMap, { COMPLETED, ONGOING, type RoadmapItem } from '$lib/components/RoadMap.svelte';

	const items: RoadmapItem[] = [
		{
			name: "Project's Start",
			date: 'Oct 2025',
			status: COMPLETED,
			description:
				'This is the first commit of the project. This lays the groundwork for the rest of the development process. I begin slowly to ensure I fully grasp the concepts of Svelte and Sveltekit, making numerous attempts to define the desired implementation and identify viable options.'
		},
		{
			name: 'Main features',
			date: 'Apr 2026',
			status: COMPLETED,
			description:
				'All the main features of the website will then be implemented, including a functioning contact form, a search engine for the blog, fully translated content and a project architecture designed for scalability and maintainability. There should also be a Dockerfile for deployment.'
		},
		{
			name: 'Fixed design',
			date: 'Jun 2026',
			status: ONGOING,
			description: 'The design should be almost complete, featuring a dynamic background and proper theme.'
		},
		{
			name: 'Blog writing',
			date: 'Jun 2026',
			status: ONGOING,
			description:
				'As most of the website is done. I should now work on its content by writing articles and working on other projects'
		},
		{
			name: 'Maintenance',
			date: 'Forever',
			status: ONGOING,
			description:
				'I will continue to work from time to time on this website, improving its design, fixing bugs and adding new features if necessary.'
		}
	];
</script>

<article class="container text-justify">
	<h1 class="title">This Website</h1>
	<p>
		This website is a way for me to keep track of my activities and my projects. I also think it could be useful for
		business partners or recruiters who want to find out more about a candidate. If you are interested, I am definitely
		the person for the job - don't hesitate to contact me!
	</p>

	<section>
		<h2 class="subtitle">Svelte and SvelteKit</h2>
		<p>
			I heard about Svelte and SvelteKit during the last year of my bachelor's degree, and I was really intrigued by
			them. The development using Svelte components seemed idiomatic and easy to use, and I was eager to try it out.
			Moreover, the more complex concepts like reactivity or transitions were introduced really well. I used SvelteKit
			to build this website because it is made by the same development team, and their ecosystem seemed complete. As a
			matter of fact, it is so complete that I freely host my website on
			<Link href="https://vercel.com" class="link">Vercel</Link>, which is also made by the same team!
			<Link href="https://svelte.dev" class="link">Their documentation</Link> is also very clear and easy to understand, with
			examples and exercises on each chapter. Even though I didn't have much experience with Javascript/Typescript or HTML/CSS,
			they made it really easy to build something decent.
		</p>
	</section>

	<section>
		<h2 class="subtitle">Goals</h2>
		<p>
			I don't want to be a full-stack developer, but I want to be able to understand the concepts behind this framework,
			and behind web development in general. I also wanted to broaden my knowledge and skills with this project, and I
			think it is a good opportunity to showcase my work, be it by building a website or by publishing
			<Link href="/articles" class="link">articles</Link> on my <Link href="/projects" class="link">projects</Link>. I
			will try to update this website's content as often as possible, so you can see it as a kind of a more complete CV.
		</p>
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
