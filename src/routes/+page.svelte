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

<div class="container">
	<p class="text-xl font-bold w-full text-center mb-5">Welcome!</p>
	<p>This platform is a mean for you to get information about my projects or myself, and a mean for me to keep a trace of my activities.</p>
	<p>I will not put to much information on this landing page to keep it minimalistic and clean. The different sections below will serve as an introduction to all the content available here.</p>
	<p>To learn more about me, you can check <a href="/about" class="link underline underline-offset-3">this page</a>, and at the <a href="#footer" class="link underline underline-offset-3">bottom of the page</a>, you can find my social media, as well as a contact form, if you want to inquire me about something.</p>
	<p>I hope you enjoy visiting my website!</p>
</div>

<WorkInProgress />

<style>
	.container {
			@apply max-w-[80%] w-auto text-justify;
	}

  .moveUpDown {
      animation: MoveUpDown 1s linear infinite;
  }

  @keyframes MoveUpDown {
      0%, 100% {
          transform: translateY(-10px);
      }
      50% {
          transform: translateY(10px);
      }
  }
</style>