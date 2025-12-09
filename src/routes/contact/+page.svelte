<script lang="ts">
	import InfoIcon from '@lucide/svelte/icons/info';
	import SendIcon from '@lucide/svelte/icons/send';

	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { browser } from '$app/environment';

	import { sortBy } from '$lib/articles-types';
	import { Button } from '$lib/components/ui/button/index';
	import * as Form from '$lib/components/ui/form/index';
	import * as InputGroup from '$lib/components/ui/input-group/index';
	import { Input } from '$lib/components/ui/input/index';
	import * as Select from '$lib/components/ui/select/index';
	import * as Tooltip from '$lib/components/ui/tooltip/index';
	import { categories, contactSchema, subjects } from '$lib/contact';

	const { data } = $props();

	const form = superForm(data.form, {
		validators: zod4Client(contactSchema),
		SPA: true
	});

	const { form: formData, enhance } = form;

	let relatedSubjects = $derived(
		$formData.category in categories
			? (subjects.get($formData.category) as Record<string, string>)
			: ({} as Record<string, string>)
	);

	function handleCategoryChange(value: string) {
		if (value === 'other') {
			formData.set({
				...$formData,
				subject: ''
			});
		}
	}
</script>

<div class="container">
	<h1 class="title">Contact Form</h1>
	<p>
		In addition to the social media links at the bottom of every page, you can use this contact form
		if you would like to communicate with me directly. Please feel free to use it if you have any
		questions or if anything is unclear. Thank you!
	</p>
</div>

<div class="container grid grid-cols-2">
	<form method="POST" use:enhance>
		<!-- Fields for firstName and lastName -->
		<div class="col-span-2 grid grid-cols-2 gap-5">
			<Form.Field {form} name="firstName">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>First Name</Form.Label>
						<Input
							class="rounded-2xl"
							{...props}
							bind:value={$formData.firstName}
							placeholder="John"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="lastName">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Last Name</Form.Label>
						<Input
							class="rounded-2xl"
							{...props}
							bind:value={$formData.lastName}
							placeholder="Doe"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<!-- Field for email -->
		<Form.Field {form} name="email" class="col-span-2">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<InputGroup.Root class="rounded-2xl">
						<InputGroup.Input
							{...props}
							bind:value={$formData.email}
							placeholder="example@mail.com"
						/>
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
									<Tooltip.Content class="w-50 rounded-2xl text-center"
										>This email address will only be used to reply to your message and will not be
										shared in any way.</Tooltip.Content
									>
								</Tooltip.Root>
							</Tooltip.Provider>
						</InputGroup.Addon>
					</InputGroup.Root>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- Fields for category and subject -->
		<div class="col-span-2 grid grid-cols-2 gap-5">
			<Form.Field {form} name="category">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Sort By</Form.Label>
						<Select.Root
							type="single"
							name="category"
							bind:value={$formData.category}
							onValueChange={(value) => {
								handleCategoryChange(value);
							}}
						>
							<Select.Trigger {...props} class="w-full rounded-2xl">
								{$formData.category ? categories[$formData.category] : 'Select a sorting order'}
							</Select.Trigger>
							<Select.Content>
								{#each Object.entries(categories) as [value, label], i (i)}
									<Select.Item {value}>{label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="subject">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Subject</Form.Label>
						{#if !browser || $formData.category === 'other' || $formData.subject === 'other'}
							<Input
								class="rounded-2xl"
								{...props}
								bind:value={$formData.subject}
								placeholder="Bug Report"
							/>
						{:else}
							<Select.Root
								type="single"
								name="subject"
								onValueChange={(value) => ($formData.subject = value)}
							>
								<Select.Trigger {...props} class="w-full rounded-2xl">
									{$formData.subject ? relatedSubjects[$formData.subject] : 'Select a subject'}
								</Select.Trigger>
								<Select.Content>
									{#each Object.entries(relatedSubjects) as [value, label], i (i)}
										<Select.Item {value}>{label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						{/if}
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<!-- Content -->

		<Button type="submit">Submit<SendIcon class="icon" /></Button>
	</form>

	<SuperDebug data={form} />
</div>
