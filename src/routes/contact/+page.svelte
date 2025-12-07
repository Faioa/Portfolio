<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';

	import { Button } from "$lib/components/ui/button/index";
	import * as Form from "$lib/components/ui/form/index";
	import { Input } from "$lib/components/ui/input/index";
	import * as InputGroup from "$lib/components/ui/input-group/index";
	import * as Tooltip from "$lib/components/ui/tooltip/index";

	import SendIcon from '@lucide/svelte/icons/send';
	import InfoIcon from "@lucide/svelte/icons/info";
	import { contactSchema } from '$lib/contact';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const { data } = $props();

	const form = superForm(data.form, {
		validators: zod4Client(contactSchema),
		SPA: true
	});

	const { form: formData, enhance } = $derived(form);
</script>

<div class="container">
	<h1 class="title">Contact Form</h1>
	<p>
		In addition to the social media links at the bottom of every page, you can use this contact form
		if you would like to communicate with me directly. Please feel free to use it if you have any
		questions or if anything is unclear. Thank you!
	</p>
</div>

<div class="container">
	<form method="POST" use:enhance>
		<!-- Field for firstName and lastName -->
		<div class="flex gap-5">
			<Form.Field {form} name="firstName">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>First Name</Form.Label>
						<Input {...props} bind:value={$formData.firstName} placeholder="John" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="lastName">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Last Name</Form.Label>
						<Input {...props} bind:value={$formData.lastName} placeholder="Doe" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>

					<InputGroup.Root>
						<InputGroup.Input {...props} bind:value={$formData.email} placeholder="example@mail.com" />
						<InputGroup.Addon align="inline-end">
							<Tooltip.Provider delayDuration={200}>
								<Tooltip.Root>
									<Tooltip.Trigger>
										{#snippet child({ props })}
											<InputGroup.Button {...props} class="rounded-full" size="icon-xs">
												<InfoIcon />
											</InputGroup.Button>
										{/snippet}
									</Tooltip.Trigger>
									<Tooltip.Content class="w-50 text-center">This email address will only be used to reply to your message and will not be sold or shared in any way.</Tooltip.Content>
								</Tooltip.Root>
							</Tooltip.Provider>
						</InputGroup.Addon>
					</InputGroup.Root>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Button type="submit">Submit<SendIcon class="icon"/></Button>
	</form>

	<SuperDebug data={form} />
</div>