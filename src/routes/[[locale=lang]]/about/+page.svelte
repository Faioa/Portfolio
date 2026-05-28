<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import { Button } from '$lib/components/ui/button';

	const { data } = $props<{ cv: string | null }>();

	let cv = $derived(data.cv);

	/* year(now_milli - birth_milli) - epoch_year = age */
	const age = new Date(Date.now() - Date.parse('2003-02-07').valueOf()).getFullYear() - 1970;
</script>

<article class="container text-justify">
	<h1 class="title">About</h1>
	<p>
		I welcome you on my website! My name is Matthieu Dartois and I am a {age}-year-old French student in Paris. The
		purpose of this page is to provide you with some information about me.
	</p>

	<section>
		<h2 class="subtitle">Me, Myself, and I</h2>
		<p>
			I discovered computer science in my first year of university with a Python introduction course. I have since
			obtained a degree in computer science and am currently pursuing a master's degree with a specialization in
			networks. I am passionate about computer science and music. I started playing the guitar on my own in my first
			year of high school. I stopped when I started college because I needed to focus on my studies. Before finishing my
			degree, I had the opportunity to take a year off before continuing the curriculum in September 2026. I took this
			opportunity to take a music theory course and start learning the violin with a professor. I fell in love with this
			incredible instrument. My self-taught guitar skills had given me a lot of bad habits, but I managed to correct
			most of them. The violin is still difficult to play, so I need to continue putting in effort before posting
			anything! I also took an introductory lute-making course to build a guitar. The course is supposed to last two
			years, and some people from previous courses have already finished their guitars. I must say, it's pretty
			motivating to see their results! I will post <Link href="/articles?tags=lute-making" class="link">articles</Link>
			about my progress in the future.
		</p>
	</section>

	<section>
		<h2 class="subtitle">Goals</h2>
		<p>
			My goals are simple. I want to learn more about music and computer science and potentially combine the two in
			projects. You can learn more about this website on <Link href="/projects/website" class="link">this page</Link>. I
			will post articles on a variety of subjects, such as lute-making and autonomous mesh networks, as long as I am
			qualified to share information on them. I also want to interact with people who point out errors in my work, are
			interested in my projects, or want to share knowledge with me.
		</p>
	</section>

	<section>
		<h2 class="subtitle">Next</h2>
		<p>
			I plan to finish my degree before looking for a job. I am not quite sure what type of position to apply for, but I
			still have some time before making a decision. In the meantime, I will continue to research and learn about
			various subjects because, given the current ecological, geographical, and political crises, it is important that I
			broaden my knowledge and become more engaged.
		</p>
	</section>

	<section>
		<p>
			Thank you for reading this far! If you are interested, you can review my CV using the button below. In any case, I
			wish you a good day!
		</p>
	</section>

	{#if cv !== null}
		<section>
			<h2 class="subtitle">Curriculum Vitæ</h2>
			<Button variant="secondary" href={cv} target="_blank" class="cursor-pointer">Open my CV</Button>
		</section>
	{/if}
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
