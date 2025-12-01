<script lang="ts">
	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { z } from 'zod';

	import { onMount } from 'svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	import { categories, filtersSchema, numberPerPage, sortBy } from '$lib/articles-types';
	import ArticlesList from '$lib/components/ArticlesList.svelte';
	import { Badge } from '$lib/components/ui/badge/index';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { Button } from '$lib/components/ui/button/index';
	import { Calendar } from '$lib/components/ui/calendar/index';
	import * as Form from '$lib/components/ui/form/index';
	import * as InputGroup from '$lib/components/ui/input-group/index';
	import * as Pagination from '$lib/components/ui/pagination/index';
	import * as Popover from '$lib/components/ui/popover/index';
	import * as Select from '$lib/components/ui/select/index';
	import { Separator } from '$lib/components/ui/separator/index';
	import * as Sheet from '$lib/components/ui/sheet/index';
	import { Switch } from '$lib/components/ui/switch/index';

	import type { PageProps } from './$types';

	let filters = new SvelteURLSearchParams(page.url.searchParams);

	function get_filter(param: string) {
		return filters.get(param) ?? undefined;
	}

	function update_filter(param: string, value: string | boolean | number | CalendarDate) {
		if (value && value !== '') filters.set(param, value.toString());
		else filters.delete(param);
	}

	function update_filter_array(param: string, value: string[]) {
		if (value.length > 0) {
			filters.delete(param);
			value.forEach((value) => filters.append(param, value));
		} else filters.delete(param);
	}

	async function apply_filters() {
		update_filter('research', research);
		if (filters.size === 0)
			await goto(resolve('/articles', {}), { keepFocus: true, invalidateAll: true });
		else
			await goto(resolve('/articles?[filters]', { filters: filters.toString() }), {
				keepFocus: true,
				invalidateAll: true
			});
	}

	function clear_filters(params: string[]) {
		params.forEach((param: string) => filters.delete(param));
	}

	function isFiltered(params: string[]) {
		return params.length > 0 && params.some((param: string) => filters.has(param));
	}

	const { data }: PageProps = $props();

	const form = superForm(data.form, {
		validators: zod4Client(filtersSchema),
		SPA: true,
		invalidateAll: false,
		resetForm: false
	});
	const { form: formData, enhance } = form;

	let totalArticles = $derived(data.articles.total);
	let articles = $derived(data.articles.ids);
	let metadata = $derived(data.metadata);

	let sheetCloseRef: HTMLButtonElement = $state(null!);

	const dateFormatter = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	const localTimeZone = getLocalTimeZone();
	const todayDate = today(localTimeZone);

	const date = z.iso.date();
	let fromDateValue = $derived(
		$formData.fromDate && date.safeParse($formData.fromDate).success
			? parseDate($formData.fromDate)
			: undefined
	);
	let toDateValue = $derived(
		$formData.toDate && date.safeParse($formData.toDate).success
			? parseDate($formData.toDate)
			: undefined
	);

	let currentPage = $state(get_filter('page') ? parseInt(get_filter('page')!) : 1);
	let research = $state(get_filter('research') ?? '');
</script>

<div class="container">
	<h1 class="title">Articles</h1>

	<!-- Form for the filters and research bar -->
	<form class="flex w-full gap-5" method="GET" use:enhance>
		<!-- Input for the research bar -->
		<Form.Field {form} name="sortBy" class="grow">
			<Form.Control>
				{#snippet children({ props })}
					<InputGroup.Root class="rounded-2xl">
						<InputGroup.Input {...props} placeholder="Search..." bind:value={research} />
						<InputGroup.Addon>
							<SearchIcon />
						</InputGroup.Addon>
						<InputGroup.Addon align="inline-end">
							<InputGroup.Button
								variant="ghost"
								class="rounded-2xl"
								type="submit"
								onclick={() => apply_filters()}
							>
								Search
							</InputGroup.Button>
						</InputGroup.Addon>
					</InputGroup.Root>
				{/snippet}
			</Form.Control>
		</Form.Field>

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
							<Select.Root
								type="single"
								name="sortBy"
								bind:value={$formData.sortBy}
								onValueChange={(value) => {
									if (!value) clear_filters(['sortBy']);
									else update_filter('sortBy', value);
								}}
							>
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
							<Switch
								{...props}
								bind:checked={$formData.featured}
								onCheckedChange={(checked) => update_filter('featured', checked)}
							/>
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
												update_filter('fromDate', v.toString());
											} else {
												$formData.fromDate = null;
												clear_filters(['fromDate']);
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
												update_filter('toDate', v.toString());
											} else {
												$formData.toDate = null;
												clear_filters(['toDate']);
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
							<Select.Root
								type="multiple"
								{...props}
								bind:value={$formData.categories}
								onValueChange={(value) => update_filter_array('categories', value)}
							>
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
							sheetCloseRef?.click();
							apply_filters();
						}}>Apply</Button
					>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Root>
	</form>
</div>

<Separator class="container" />

<div class="container">
	<ArticlesList {articles} {metadata} />
</div>

{#if totalArticles > 0}
	<Pagination.Root
		count={totalArticles}
		perPage={numberPerPage}
		bind:page={currentPage}
		onPageChange={() => {
			update_filter('page', currentPage.toString());
			apply_filters();
		}}
	>
		{#snippet children({ pages, currentPage })}
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.PrevButton id="prevButton">
						{#if !browser}
							<a
								href={resolve('/articles?page=[page]', { page: (currentPage - 1).toString() })}
								aria-labelledby="prevButton"
								class="flex items-center gap-1"
							>
								<ChevronLeftIcon class="icon" />
								<span>Previous</span>
							</a>
						{:else}
							<div class="flex items-center gap-1">
								<ChevronLeftIcon class="icon" />
								<span>Previous</span>
							</div>
						{/if}
					</Pagination.PrevButton>
				</Pagination.Item>
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else if !browser}
						<a href={resolve('/articles?page=[page]', { page: page.value.toString() })}>
							<Pagination.Item>
								<Pagination.Link {page} isActive={currentPage === page.value}>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						</a>
					{:else}
						<Pagination.Item>
							<Pagination.Link {page} isActive={currentPage === page.value}>
								{page.value}
							</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item>
					<Pagination.NextButton>
						{#if !browser}
							<a
								href={resolve('/articles?page=[page]', { page: (currentPage + 1).toString() })}
								aria-labelledby="prevButton"
								class="flex items-center gap-1"
							>
								<span>Next</span>
								<ChevronRightIcon class="icon" />
							</a>
						{:else}
							<div class="flex items-center gap-1">
								<span>Next</span>
								<ChevronRightIcon class="icon" />
							</div>
						{/if}
					</Pagination.NextButton>
				</Pagination.Item>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
{/if}

<style>
</style>
