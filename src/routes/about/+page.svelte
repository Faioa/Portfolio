<script lang="ts">
	import cv from '$lib/assets/cv-fr.pdf';
	import { Button } from '$lib/components/ui/button';

	/* year(now_milli - birth_milli) - epoch_year = age */
	const age = new Date(Date.now() - Date.parse('2003-02-07').valueOf()).getFullYear() - 1970;
</script>

<article class="container text-justify">
	<h1 class="title">About</h1>
	<p>
		First of all, who am I? My name is Matthieu Dartois and I am a {age}-year-old French student,
		but there is a fairly good chance that you already knew that before coming here. The purpose of
		this page is to provide you with some additional information about me. I'm not quite sure what
		information should be included on this page or how it should be presented, but I'll do my best.
	</p>

	<section>
		<h2 class="subtitle">Me, Myself, and I</h2>
		<p>
			I suppose I should talk about myself a bit, since that's kind of the point of this page.
			However, I don't want to seem pretentious, and I'm not comfortable with exposing too much of
			myself. So, I'll be brief and get straight to the point. I am passionate about music and
			computer science, but a lack of free time during my Master's degree meant that I couldn't play
			music or do anything else. This had a negative impact on me, and I felt a little regretful,
			lost and depressed about not achieving anything. That is why I decided to take a year off from
			university. I joined a music organisation to take violin lessons, and I study computer science
			in my remaining free time. My first goal is to complete this website/portfolio before moving
			on to the main topic: Flux Studio. The name may be temporary, but it represents what I want to
			achieve: a smooth, versatile tool for playing music. This is a way for me to combine both
			worlds during my year off and explore lots of different tools and subjects that I wouldn't
			encounter in my classes. I will use the articles to share my achievements, the problems I
			encounter, and the knowledge I have acquired, hoping that you will learn something from them
			and/or get your feedback to help me learn more.
		</p>
	</section>

	<section>
		<h2 class="subtitle">Music</h2>
		<p>
			My relationship with music is complicated. It has always been an important part of my life,
			yet I have never fully committed to playing it. I was motivated during high school, but the
			pandemic put a sudden stop to that. During my first years at university, I played the guitar
			occasionally and suddenly felt the urge to buy all kinds of musical instruments. To this day,
			I still don't know how to play most of them. I hope that the music theory lessons I am taking
			now will provide me with a foundation that will make me feel more confident with any
			instrument — at least I won't be completely lost. I cannot imagine my life without an
			instrument or music in the background. With Flux Studio, I hope to combine my hobby with my
			work by providing a tool for anyone to play and learn music. Perhaps one day I will be able to
			compose pieces too! I'm not sure whether to add a music theory section to this website with
			the tips and tricks that I learn or find, since there are already plenty of good online
			resources, and I don't want to create something substandard that might contain incorrect
			information.
		</p>
	</section>

	<section>
		<h2 class="subtitle">Computer Science</h2>
		<p>
			I discovered programming in my first year at university, studying Python and C. I found the
			first Python course terrible, but loved the C one. I therefore took the computer science
			course at my university for my second and third years of my bachelor's degree. I completed two
			internships during this time, which broadened my horizons, particularly the second one, which
			was in a laboratory. I will write an article about it later, as it was really interesting. To
			give you a brief overview, my team needed to create autonomous, dynamic mesh networks for use
			by firefighters in isolated areas without an Internet connection. As you might have guessed, I
			specialised in networks for my master's degree and successfully completed the first year. I
			cannot say which aspect interests me the most, but I find the whole field fascinating. I plan
			to make the most of my year off by studying <a href="https://ocw.mit.edu/" class="link"
				>MIT open courses</a
			> and scientific papers in other fields, such as cybersecurity and artificial intelligence.
		</p>
		<p>
			On the subject of artificial intelligence, I admit that I use it myself sometimes. I have a
			mixed view of it: it might be useful for saving time, but it is counterproductive in a
			learning context because you don't put much thought into your work. That is mainly why I avoid
			using it too much. On this website, for instance, I encountered some issues with SvelteKit's
			behaviour when routing pages, so I used Anthropic's Claude chatbot to gain insight into the
			situation and resolved it myself. AI doesn't create the project, but it certainly saves me
			time on research when I hit a wall. The environmental impact in terms of energy and pollution
			should also be considered seriously, in my opinion. I also avoid using too much AI for this
			reason.
		</p>
	</section>

	<section>
		<h2 class="subtitle">Curriculum Vitæ</h2>
		<Button variant="secondary" href={cv} target="_blank" class="cursor-pointer">Open my CV</Button>
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
