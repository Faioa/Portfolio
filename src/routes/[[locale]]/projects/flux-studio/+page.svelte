<script lang="ts">
	import WorkInProgress from '$lib/components/WorkInProgress.svelte';
</script>

<article class="container text-justify">
	<h1 class="title">Flux Studio</h1>
	<p>
		Flux Studio is a soon-to-be developed <span class="font-bold">Digital Audio Workstation</span>
		using <span class="font-bold italic">Rust</span>. My goal is to develop a first-class DAW for playing and learning
		music. My goals are ambitious, but I will do my best to see this project through. As you may have guessed, music is
		my passion, and I want it to be a central element of my life, whether through playing music or developing this
		software.
	</p>
	<p>
		This is also an opportunity for me to learn Rust, which seems like a really promising programming language. You can
		find out more at <a href="https://rust-lang.org/" class="link">their website</a> directly for more details, but it might
		just become my go-to language for almost every use cases. Despite the fact that the Rust community is relatively new,
		the Rustaceans (the name of the Rust developers' community) are very active, and the available resources are constantly
		growing. There is even debate about whether this language should be included in the Linux Kernel. I will leave you to
		do your own research on this subject, as this is not the main topic of this page.
	</p>
	<p class="w-full">The content of this page is bound to change as the project progresses.</p>

	<section>
		<h2 class="subtitle">Main goals</h2>
		<p>
			My first goal is to successfully process and generate live audio signals. I want to be able to manipulate the gain
			and recognise or decompose the frequencies within the signal. The next step would be to add a graphical user
			interface (GUI) for manipulating the signals. I think the GUI will be the most challenging aspect of this project.
			As you may have gathered from this website, UI/UX design is not my forte. However, I don't plan on creating a
			substandard GUI, even if it takes me a long time to refine it. I am still thinking about the next steps in this
			project. I have lots of ideas, but I don't yet know the intermediate steps, and I need to be realistic about which
			features I can actually implement.
		</p>
	</section>

	<section>
		<h2 class="subtitle">Expected difficulties</h2>
		<p>
			As I have never used Rust before, it is difficult for me to anticipate the issues I will encounter on this
			project. However, I think the main issues will stem from the relatively new Rust ecosystem, since many of its
			crates are not yet mature. For example, there is no consensus on which crate to use for creating graphical
			interfaces for applications. Many different projects are being developed to meet the needs of the community, each
			with their own particular features, but none of them are particularly notable. I need to do a lot of research for
			this, and I will probably publish an article about my findings.
		</p>
		<p>
			The second obstacle that I fear the most is developing a cross-platform application. From the outset, I intend to
			develop Flux Studio with modular code to simplify the management of the various crates required for each operating
			system. However, I am still anxious about the moment when I attempt to optimise the application. I have no
			experience of cross-platform development so far, so my worries may be unfounded.
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
