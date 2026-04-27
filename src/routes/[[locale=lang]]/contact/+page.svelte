<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import Form from '$lib/components/Form.svelte';
	import Letter from '$lib/components/Letter.svelte';
	import { contactSchema } from '$lib/contact';

	const { data } = $props();

	let form = $derived(superForm(data.form, { validators: zod4Client(contactSchema) }));
</script>

<div class="container">
	<h1 class="title">Contact Form</h1>

	<p class="text-center">
		In addition to the social media links at the bottom of every page, you can use this contact form to get in touch
		with me directly. Please feel free to use it if you have any questions or if anything is unclear.
	</p>

	<!-- Letter container for the send animation -->
	<Letter
		class="relative h-auto w-full md:w-125"
		close={false}
		animate={true}
		closedMessage="Thank you for your message! I will get back to you as soon as possible."
	>
		<!-- Contact form-->
		<Form {form} />
	</Letter>
</div>
