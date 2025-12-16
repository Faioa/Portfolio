<script lang="ts">
	import InfoIcon from '@lucide/svelte/icons/info';
	import SendIcon from '@lucide/svelte/icons/send';
	import XIcon from '@lucide/svelte/icons/x';

	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { browser } from '$app/environment';

	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import * as InputGroup from '$lib/components/ui/input-group';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import {
		getCategoryLabel, type Category, contactSchema, maxContent, minContent, getSubjectLabel, categoriesSubjects,
		categoriesValues
	} from '$lib/contact';

	const { data } = $props();

	const form = superForm(data.form, { validators: zod4Client(contactSchema) });

	const { form: formData, enhance } = form;

	let relatedSubjects = $derived(
		$formData.category in categoriesSubjects
			? categoriesSubjects[$formData.category]
			: []
	);

	let otherSubject: boolean = $state(!browser);

	function resetSubject() {
		if (!($formData.subject in relatedSubjects)) $formData.subject = '';
		if ($formData.category !== 'other') otherSubject = false;
	}
</script>

<div class="container">
	<h1 class="title">Contact Form</h1>
	<p class="text-center">
		In addition to the social media links at the bottom of every page, you can use this contact form
		to get in touch with me directly. Please feel free to use it if you have any questions or if
		anything is unclear.
		<br />Thank you!
	</p>
</div>

<div class="container grid grid-cols-2 gap-y-4">
	<form method="POST" use:enhance class="w-150">
		<!-- Fields for firstName and lastName -->
		<div class="col-span-2 grid grid-cols-2 gap-5">
			<Form.Field {form} name="firstName">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="fieldName">First Name</Form.Label>
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
						<Form.Label class="fieldName">Last Name</Form.Label>
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
					<Form.Label class="fieldName">Email</Form.Label>
					<InputGroup.Root class="rounded-2xl">
						<InputGroup.Input
							{...props}
							bind:value={$formData.email}
							placeholder="example@email.com"
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
						<Form.Label class="fieldName">Category</Form.Label>
						<Select.Root
							type="single"
							name="category"
							bind:value={$formData.category}
							onValueChange={(value) => {
								if (value === 'other') {
									$formData.subject = '';
									otherSubject = true;
								} else {
									$formData.subject = '';
									otherSubject = false;
								}
							}}
						>
							<Select.Trigger {...props} class="w-full rounded-2xl">
								{$formData.category ? getCategoryLabel($formData.category) : 'Select a category'}
							</Select.Trigger>
							<Select.Content>
								{#each categoriesValues as value, i (i)}
									<Select.Item {value}>{getCategoryLabel(value)}</Select.Item>
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
						<Form.Label class="fieldName">Subject</Form.Label>
						{#if otherSubject}
							<InputGroup.Root class="rounded-2xl">
								<InputGroup.Input
									{...props}
									bind:value={$formData.subject}
									placeholder="Bug Report"
								/>
								<InputGroup.Addon align="inline-end">
									<InputGroup.Button
										aria-label="Undo"
										title="Undo"
										size="icon-xs"
										class="rounded-full"
										onclick={resetSubject}
										><XIcon class="icon" />
									</InputGroup.Button>
								</InputGroup.Addon>
							</InputGroup.Root>
						{:else}
							<Select.Root
								type="single"
								name="subject"
								bind:value={$formData.subject}
								onValueChange={(value) => {
									if (value === 'other') {
										$formData.subject = '';
										otherSubject = true;
									}
								}}
							>
								<Select.Trigger {...props} class="w-full rounded-2xl">
									{$formData.subject ? getSubjectLabel($formData.subject) : 'Select a subject'}
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
		<Form.Field {form} name="content" class="col-span-2">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="fieldName">Content</Form.Label>
					<div class="flex flex-col gap-1">
						<Textarea
							class="h-40 resize-none rounded-2xl"
							{...props}
							bind:value={$formData.content}
							placeholder="Type your message here"
						/>
					</div>
				{/snippet}
			</Form.Control>
			<div class="mr-2 flex items-center justify-between self-end">
				<Form.FieldErrors />
				<p class="text-sm">
					<span
						class={$formData.content.length >= minContent && $formData.content.length <= maxContent
							? ''
							: 'text-destructive'}>{$formData.content.length}</span
					>
					/ {maxContent}
				</p>
			</div>
		</Form.Field>

		<Button type="submit">Submit<SendIcon class="icon" /></Button>
	</form>
</div>

<style>
	form :global(.fieldName) {
		font-weight: bold;
	}
</style>
