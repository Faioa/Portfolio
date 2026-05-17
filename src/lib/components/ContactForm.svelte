<script lang="ts">
	import InfoIcon from '@lucide/svelte/icons/info';
	import SendIcon from '@lucide/svelte/icons/send';
	import XIcon from '@lucide/svelte/icons/x';

	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { browser } from '$app/environment';

	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Popover from '$lib/components/ui/popover';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import {
		type ContactSchema,
		categories,
		categoriesSubjects,
		contactSchema,
		getCategoryLabel,
		getSubjectLabel,
		maxContent,
		minContent
	} from '$lib/contact';
	import { cn } from '$lib/utils';

	/**
	 * The Props interface defines the structure for the properties used in the ContactForm component.
	 *
	 * @interface Props
	 *
	 * @property {SuperValidated<Infer<ContactSchema>>} form - Represents a superform object, managing the structure and data for the specified fields of the form. It follows a zod schema exported in $lib/contact.ts.
	 * @property {boolean} [processing=false] - A boolean value indicating whether the form is currently being processed.
	 * @property {(form?: SuperValidated<Infer<ContactSchema>>) => void} [onUpdated=() => {}] - A callback function that is triggered when the form is updated. It receives the updated form as an argument, if any.
	 * @property {string} [class] - An optional CSS class name to style the component.
	 */
	interface Props {
		formProp: SuperValidated<Infer<ContactSchema>>;
		processing?: boolean;
		onUpdated?: (form?: SuperValidated<Infer<ContactSchema>>) => void;
		class?: string;
	}

	let {
		formProp = $bindable(),
		processing = $bindable(false),
		onUpdated = $bindable(() => {}),
		class: className
	}: Props = $props();

	const form = superForm(formProp, {
		invalidateAll: false,
		validators: zod4Client(contactSchema),
		onUpdated({ form }) {
			onUpdated(form);
		},
		onSubmit() {
			processing = true;
		},
		onResult() {
			processing = false;
		}
	});

	let { form: formData, enhance } = form;

	let relatedSubjects = $derived(
		$formData.category in categoriesSubjects ? categoriesSubjects[$formData.category] : []
	);

	let other: boolean = $state(!browser || $formData.subject === 'other' || $formData.category === 'other');

	function resetSubject() {
		if (!($formData.subject in relatedSubjects)) $formData.subject = '';
		if ($formData.category !== 'other') other = false;
	}
</script>

<form method="POST" use:enhance class={cn(className, 'relative grid grid-cols-2 gap-3')}>
	<!-- Fields for firstName and lastName -->
	<Form.Field {form} name="firstName" class="col-span-1">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="fieldName">First Name</Form.Label>
				<Input class="rounded-2xl" {...props} bind:value={$formData.firstName} placeholder="John" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors errorClasses="text-xs! md:text-sm! truncate" />
	</Form.Field>

	<Form.Field {form} name="lastName" class="col-span-1">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="fieldName">Last Name</Form.Label>
				<Input class="rounded-2xl" {...props} bind:value={$formData.lastName} placeholder="Doe" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors errorClasses="text-xs! md:text-sm! truncate" />
	</Form.Field>

	<!-- Field for email -->
	<Form.Field {form} name="email" class="col-span-2">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="fieldName">Email</Form.Label>
				<InputGroup.Root class="rounded-2xl">
					<InputGroup.Input {...props} bind:value={$formData.email} placeholder="example@email.com" />
					<InputGroup.Addon align="inline-end">
						<Popover.Root>
							<Popover.Trigger openOnHover={true} openDelay={200}>
								{#snippet child({ props })}
									<InputGroup.Button {...props} class="rounded-full cursor-help" size="icon-xs">
										<InfoIcon />
									</InputGroup.Button>
								{/snippet}
							</Popover.Trigger>
							<Popover.Content class="max-w-50 rounded-2xl text-center text-xs! md:text-sm!">
								This email address will only be used to reply to your message and will not be shared in any way.
							</Popover.Content>
						</Popover.Root>
					</InputGroup.Addon>
				</InputGroup.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors errorClasses="text-xs! md:text-sm! truncate" />
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
								other = true;
							} else {
								$formData.subject = '';
								other = false;
							}
						}}
					>
						<Select.Trigger {...props} class="w-full rounded-2xl">
							{$formData.category ? getCategoryLabel($formData.category) : 'Select a category'}
						</Select.Trigger>
						<Select.Content>
							{#each categories as value, i (i)}
								<Select.Item {value}>{getCategoryLabel(value)}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors errorClasses="text-xs! md:text-sm! truncate" />
		</Form.Field>

		<Form.Field {form} name="subject">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="fieldName">Subject</Form.Label>
					{#if other}
						<InputGroup.Root class="rounded-2xl">
							<InputGroup.Input {...props} bind:value={$formData.subject} placeholder="Bug Report" />
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
									other = true;
								}
							}}
						>
							<Select.Trigger {...props} class="w-full rounded-2xl">
								{$formData.subject ? getSubjectLabel($formData.subject) : 'Select a subject'}
							</Select.Trigger>
							<Select.Content>
								{#each relatedSubjects as value, i (i)}
									<Select.Item {value}>{getSubjectLabel(value)}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/if}
				{/snippet}
			</Form.Control>
			<Form.FieldErrors errorClasses="text-xs! md:text-sm! truncate" />
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

		<div class="mr-2 flex items-center justify-between">
			<Form.FieldErrors errorClasses="text-xs! md:text-sm! truncate" />
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

	<!-- Submit button -->
	<div class="col-span-2 flex w-full items-center justify-between">
		<div class="text-xs! font-bold text-muted-foreground italic md:text-sm!">All fields are mandatory</div>
		<Button type="submit" variant="secondary" class="w-min">Submit<SendIcon class="icon" /></Button>
	</div>
</form>

<style>
	form :global(.fieldName) {
		font-weight: bold;
	}
</style>
