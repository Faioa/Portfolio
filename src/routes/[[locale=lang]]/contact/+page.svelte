<script lang="ts">
	import Loader from '@lucide/svelte/icons/loader';

	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import ContactForm from '$lib/components/ContactForm.svelte';
	import Letter from '$lib/components/Letter.svelte';
	import { contactSchema } from '$lib/contact';

	const { data } = $props();

	let closeLetter = $state(false);
	let processing = $state(false);

	let form = $derived(
		superForm(data.form, {
			invalidateAll: false,
			validators: zod4Client(contactSchema),
			onUpdated({ form }) {
				if (form.valid) {
					closeLetter = true;
				}
			},
			onSubmit() {
				processing = true;
			},
			onResult() {
				processing = false;
			}
		})
	);
</script>

<div class="container">
	<h1 class="title">Contact Form</h1>

	<p class="text-center">
		In addition to the social media links at the bottom of every page, you can use this contact form to get in touch
		with me directly. Please feel free to use it if you have any questions or if anything is unclear.
	</p>

	<!-- Letter container for the send animation -->
	<Letter
		class="relative h-full min-h-100 w-full md:w-125"
		bind:close={closeLetter}
		animate={true}
		closedMessage="Thank you for your message! I will get back to you as soon as possible."
	>
		<!-- Contact form-->
		<ContactForm {form} class={processing ? 'pointer-events-none opacity-40' : ''} />

		<!-- Loader -->
		<Loader
			class="absolute top-1/2 left-1/2 z-20 size-8 -translate-x-1/2 -translate-y-1/2 animate-spin {processing
				? ''
				: 'hidden'}"
		/>
	</Letter>
</div>
