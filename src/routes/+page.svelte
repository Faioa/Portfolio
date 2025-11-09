<script>
	import Guitar from "$lib/components/Guitar.svelte";
	import WorkInProgress from "$lib/components/WorkInProgress.svelte";
	import ChevronDown from "@lucide/svelte/icons/chevron-down"
</script>

<div class="relative flex gap-5 items-start">
	<div class="absolute left-[-75%] top-[40%] moveUpDown flex gap-2 items-center whitespace-nowrap">
		<ChevronDown class="icon"/>
		<p class="flex">Scroll down or hover the strings...</p>
		<ChevronDown class="icon"/>
	</div>

	<Guitar />

	<div class="absolute left-[100%] top-[60%] moveUpDown flex gap-2 items-center whitespace-nowrap">
		<ChevronDown class="icon"/>
		<p class="inline-flex gap-1">...to animate the guitar!<span class="text-destructive"> (Work in Progress)</span></p>
		<ChevronDown class="icon"/>
	</div>
</div>

<div class="container welcome">
	<p class="title w-full my-10">Welcome!</p>
	<p>This platform is a mean for you to get information about my projects or myself, and a mean for me to keep a trace of my activities.</p>
	<p>I will not put to much information on this landing page to keep it minimalistic and clean. The different sections below will serve as an introduction to all the content available here.</p>
	<p>To learn more about me, you can check <a href="/about" class="link underline underline-offset-3">this page</a>, and at the <a href="#footer" class="link underline underline-offset-3">bottom of the page</a>, you can find my social media, as well as a contact form, if you want to inquire me about something.</p>
	<p>I hope you enjoy visiting my website!</p>
</div>


<div class="container">
	<h2 class="title w-full text-center">Featured Projects</h2>
	<div class="grid grid-cols-2 gap-10 my-10">
		<div class="card">
			<h2 class="text-lg font-bold">Flux Studio</h2>
			<p>Flux studio is a soon-to-be developed <span class="font-bold">Digital Audio Workstation</span> using <span class="font-bold italic">Rust</span>. My aim is to create a top-notch DAW that can be used for playing and learning music. My goals are ambitious, but I will do my best to see this project through nonetheless.</p>
			<a href="/projects/flux-studio" class="link text-sm self-end absolute bottom-5">Read More</a>
		</div>

		<div class="card flex flex-col gap-2">
			<h2 class="text-lg font-bold">This Website</h2>
			<p>This website is both a portfolio and a blog developed with <span class="font-bold italic">Svelte</span> and <span class="font-bold italic">SvelteKit</span>. I will post updates on my projects and experiences, as well as anything else I find interesting. It is also a way for you to contact me. This project is an opportunity for me to experiment with web development.</p>
			<a href="/projects/website" class="link text-sm self-end absolute bottom-5">Read More</a>
		</div>
	</div>
</div>

<div class="container">
	<h2 class="title w-full text-center">Recent Articles</h2>
	<WorkInProgress />
</div>


<style>
	.container {
      width: auto;
      max-width: 90%;
      text-align: justify;
      margin: calc(var(--spacing) * 10);
	}

	.card {
			display: flex;
			flex-direction: column;
      gap: calc(var(--spacing) * 2);
      position: relative;
      border-radius: var(--radius);
      --tw-shadow: var(--shadow-md);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
      padding: calc(var(--spacing) * 5);
      padding-bottom: calc(var(--spacing) * 10);
	}

	.title {
      --tw-font-weight: var(--font-weight-bold);
      font-weight: var(--font-weight-bold);
      font-size: var(--text-2xl);
      line-height: var(--tw-leading, var(--text-2xl--line-height));
	}

	.welcome {
      text-align: center;
	}

  .moveUpDown {
      animation: MoveUpDown 2s linear infinite;
  }

  @keyframes MoveUpDown {
      0%, 100% {
          transform: translateY(-5px);
      }
      50% {
          transform: translateY(5px);
      }
  }
</style>