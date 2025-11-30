<script lang="ts">
	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import SearchIcon from '@lucide/svelte/icons/search';

	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { categories, filtersSchema, sortBy } from '$lib/articles-types';
	import ArticlesList from '$lib/components/ArticlesList.svelte';
	import { Badge } from '$lib/components/ui/badge/index';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { Button } from '$lib/components/ui/button/index';
	import { Calendar } from '$lib/components/ui/calendar/index';
	import * as Form from '$lib/components/ui/form/index';
	import * as InputGroup from '$lib/components/ui/input-group/index';
	import * as Popover from '$lib/components/ui/popover/index';
	import * as Select from '$lib/components/ui/select/index';
	import { Separator } from '$lib/components/ui/separator/index';
	import * as Sheet from '$lib/components/ui/sheet/index';
	import { Switch } from '$lib/components/ui/switch/index';

	import type { PageProps } from './$types';

	const { data, form: formAction }: PageProps = $props();

	const form = superForm(data.form, {
		validators: zod4Client(filtersSchema),
		SPA: true,
		invalidateAll: false,
		resetForm: false
	});
	const { form: formData, enhance } = form;

	const articles = formAction?.articles ? formAction.articles : data.articles;
	const metadata = formAction?.metadata ? formAction.metadata : data.metadata;

	let sheetCloseRef: HTMLButtonElement = $state(null!);
	let formRef: HTMLFormElement = $state(null!);

	const dateFormatter = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	const localTimeZone = getLocalTimeZone();
	const todayDate = today(localTimeZone);

	let fromDateValue = $derived($formData.fromDate ? parseDate($formData.fromDate) : undefined);
	let toDateValue = $derived($formData.toDate ? parseDate($formData.toDate) : undefined);
</script>

<div class="container">
	<h1 class="title">Articles</h1>

	<!-- Form for the filters and research bar -->
	<form bind:this={formRef} class="flex w-full gap-5" method="POST" use:enhance>
		<!-- Input for the research bar -->
		<Form.Field {form} name="research" class="grow">
			<Form.Control>
				{#snippet children({ props })}
					<InputGroup.Root {...props} class="rounded-2xl">
						<InputGroup.Input name="research" placeholder="Search..." />
						<InputGroup.Addon>
							<SearchIcon />
						</InputGroup.Addon>
						<InputGroup.Addon align="inline-end">
							<InputGroup.Button
								variant="ghost"
								class="rounded-2xl"
								type="submit"
								onclick={() => formRef.submit()}
							>
								Search
							</InputGroup.Button>
						</InputGroup.Addon>
					</InputGroup.Root>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- Hidden inputs for the filters' submitted values -->
		<input hidden value={$formData.sortBy} name="sortBy" />
		<input hidden value={$formData.featured} name="featured" />
		<input hidden value={$formData.fromDate} name="fromDate" />
		<input hidden value={$formData.toDate} name="toDate" />
		{#each $formData.categories as category, i (i)}
			<input hidden name="categories" value={category} />
		{/each}

		<!-- Filters' sheet -->
		<Sheet.Root>
			<Sheet.Trigger
				class="flex items-center rounded-2xl
								{buttonVariants.variants.variant.outline}
								{buttonVariants.variants.size.default}"
			>
				Filters
			</Sheet.Trigger>

			<Sheet.Content class="flex flex-col items-start">
				<Sheet.Header class="flex w-full flex-col items-center justify-center gap-3">
					<Sheet.Close bind:ref={sheetCloseRef}></Sheet.Close>
					<Sheet.Title class="subtitle">Filters</Sheet.Title>
					<Sheet.Description class="text-center">
						Select the filters you want to use for your research.
					</Sheet.Description>
					<Separator />
				</Sheet.Header>

				<!-- Filters' form fields -->
				<!-- Sort By -->
				<Form.Field {form} name="sortBy">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Sort By</Form.Label>
							<Select.Root type="single" name="sortBy" bind:value={$formData.sortBy}>
								<Select.Trigger {...props} class="rounded-2xl">
									{$formData.sortBy ? sortBy[$formData.sortBy] : 'Select a sorting order'}
								</Select.Trigger>
								<Select.Content>
									{#each Object.entries(sortBy) as [value, label], i (i)}
										<Select.Item {value}>{label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						{/snippet}
					</Form.Control>
					<Form.Description
						>You can choose how the results are sorted with this filter.</Form.Description
					>
					<Form.FieldErrors />
				</Form.Field>

				<!-- Featured -->
				<Form.Field {form} name="featured">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Featured</Form.Label>
							<Switch {...props} bind:checked={$formData.featured} />
						{/snippet}
					</Form.Control>
					<Form.Description
						>You can choose if you want to search for featured articles or not.</Form.Description
					>
					<Form.FieldErrors />
				</Form.Field>

				<!-- From Date -->
				<Form.Field {form} name="fromDate">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Posted After</Form.Label>
							<Popover.Root>
								<Popover.Trigger
									{...props}
									class="flex items-center gap-2 rounded-2xl border-1 px-2 py-1 {!$formData.fromDate
										? 'text-muted-foreground'
										: ''}"
								>
									<CalendarIcon class="icon opacity-50" />
									{fromDateValue
										? dateFormatter.format(fromDateValue.toDate(localTimeZone))
										: 'Pick a date'}
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="top">
									<Calendar
										type="single"
										captionLayout="dropdown"
										placeholder={todayDate}
										value={fromDateValue}
										minValue={new CalendarDate(2025, 11, 1)}
										maxValue={toDateValue ? toDateValue : todayDate}
										onValueChange={(v) => {
											if (v) {
												$formData.fromDate = v.toString();
											} else {
												$formData.fromDate = null;
											}
										}}
									/>
								</Popover.Content>
							</Popover.Root>
						{/snippet}
					</Form.Control>
					<Form.Description>You can filter all articles posted after this date.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<!-- To Date -->
				<Form.Field {form} name="toDate">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Posted Before</Form.Label>
							<Popover.Root>
								<Popover.Trigger
									{...props}
									class="flex items-center gap-2 rounded-2xl border-1 px-2 py-1 {!$formData.toDate
										? 'text-muted-foreground'
										: ''}"
								>
									<CalendarIcon class="icon opacity-50" />
									{toDateValue
										? dateFormatter.format(toDateValue.toDate(localTimeZone))
										: 'Pick a date'}
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="top">
									<Calendar
										type="single"
										captionLayout="dropdown"
										placeholder={todayDate}
										value={toDateValue}
										minValue={fromDateValue ? fromDateValue : new CalendarDate(2025, 11, 1)}
										maxValue={todayDate}
										onValueChange={(v) => {
											if (v) {
												$formData.toDate = v.toString();
											} else {
												$formData.toDate = null;
											}
										}}
									/>
								</Popover.Content>
							</Popover.Root>
						{/snippet}
					</Form.Control>
					<Form.Description>You can filter all articles posted before this date.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<!-- Categories -->
				<Form.Field {form} name="categories">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Categories</Form.Label>
							<Select.Root type="multiple" {...props} bind:value={$formData.categories}>
								<Select.Trigger class="rounded-2xl">Select the tags</Select.Trigger>
								<Select.Content>
									{#each Object.entries(categories) as [value, label], i (i)}
										<Select.Item {value}>{label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
							{#if $formData.categories && $formData.categories.length > 0}
								<div class="flex flex-wrap items-center gap-2">
									{#each $formData.categories as category, i (i)}
										<Badge variant="secondary">{categories[category]}</Badge>
									{/each}
								</div>
							{/if}
						{/snippet}
					</Form.Control>
					<Form.Description
						>You can filter the resulting articles based on their tags (the articles will match all
						tags).</Form.Description
					>
					<Form.FieldErrors />
				</Form.Field>

				<!-- Filters' submit button -->
				<Sheet.Footer class="flex w-full flex-col items-center justify-center gap-3">
					<Button
						variant="outline"
						class="rounded-2xl"
						onclick={() => {
							formRef.submit();
							sheetCloseRef?.click();
						}}>Apply</Button
					>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Root>
	</form>
</div>

<Separator class="container" />

<div class="container">
	<ArticlesList articles={articles.ids} {metadata} />
</div>

<style>
</style>
