<script lang="ts">
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import SearchIcon from '@lucide/svelte/icons/search';

	import { type Snippet, tick } from 'svelte';
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';

	import {
		type FiltersSchema,
		defaultPerPage,
		defaultSortBy,
		getSortByLabel,
		getTagLabel,
		sortByValues,
		tagsValues
	} from '$lib/articles-types';
	import { filtersSchema } from '$lib/articles-types';
	import { defaultFeatured } from '$lib/articles-types.js';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as NativeSelect from '$lib/components/ui/native-select';
	import * as Pagination from '$lib/components/ui/pagination';
	import * as Popover from '$lib/components/ui/popover';
	import * as Select from '$lib/components/ui/select';
	import { Switch } from '$lib/components/ui/switch';
	import { defaultLocale } from '$lib/lang';
	import { cn } from '$lib/utils';

	interface Props {
		formProp: SuperValidated<Infer<FiltersSchema>>;
		itemsCount?: number;
		class?: string;
		childrenClass?: string;
		children?: Snippet;
	}

	let {
		formProp = $bindable(),
		itemsCount = $bindable(0),
		class: className = '',
		childrenClass = '',
		children
	}: Props = $props();

	const form = superForm(formProp, {
		invalidateAll: false,
		resetForm: false,
		validators: zod4Client(filtersSchema)
	});

	const { form: formData } = form;

	let formRef: HTMLFormElement | null | undefined = $state(null);

	let dateStartValue = $state($formData.dateStart ? parseDate($formData.dateStart) : undefined);
	let dateEndValue = $state($formData.dateEnd ? parseDate($formData.dateEnd) : undefined);

	function updateDateStart(value?: DateValue) {
		dateStartValue = value as CalendarDate | undefined;
		$formData.dateStart = value?.toString();

		if (dateEndValue && value && dateEndValue.compare(value) < 0) {
			$formData.dateEnd = undefined;
			dateEndValue = undefined;
		}

		resetPage();
	}

	function updateDateEnd(value?: DateValue) {
		dateEndValue = value as CalendarDate | undefined;
		$formData.dateEnd = value?.toString();

		if (dateStartValue && value && dateStartValue.compare(value) < 0) {
			$formData.dateStart = undefined;
			dateStartValue = undefined;
		}

		resetPage();
	}

	let snapshot = $state({
		dateStart: $formData.dateStart,
		dateEnd: $formData.dateEnd,
		featured: $formData.featured,
		pageNumber: $formData.page,
		perPage: $formData.perPage,
		research: $formData.research,
		sortBy: $formData.sortBy,
		tags: $formData.tags
	});

	const modified = $derived(
		!(
			$formData.dateStart === snapshot.dateStart &&
			$formData.dateEnd === snapshot.dateEnd &&
			$formData.featured === snapshot.featured &&
			$formData.perPage === snapshot.perPage &&
			$formData.research === snapshot.research &&
			$formData.sortBy === snapshot.sortBy &&
			arrayCompare($formData.tags, snapshot.tags)
		)
	);

	/*
	 * Utility functions to compare arrays.
	 */
	function arrayCompare(
		a: unknown[] | undefined | null,
		b?: unknown[] | undefined | null,
		ignoreOrder: boolean = false
	) {
		if (a === b) return true;

		if (!a || !b) return false;

		if (a.length !== b.length) return false;

		if (ignoreOrder) {
			return a.every((item, i) => item === b[i]);
		}

		// Uses copies so that the original arrays are not modified
		const sortedA = [...a].sort();
		const sortedB = [...b].sort();
		return sortedA.every((item, i) => item === sortedB[i]);
	}

	/*
	 * This function is used to handle the submitting of the form. It updates the snapshot to keep the data consistent between two submits.
	 */
	function saveForm(force: boolean = false) {
		if (modified || force) {
			snapshot.dateStart = $formData.dateStart;
			dateStartValue = $formData.dateStart ? parseDate($formData.dateStart) : undefined;
			snapshot.dateEnd = $formData.dateEnd;
			dateEndValue = $formData.dateEnd ? parseDate($formData.dateEnd) : undefined;
			snapshot.featured = $formData.featured;
			snapshot.perPage = $formData.perPage;
			snapshot.research = $formData.research;
			snapshot.sortBy = $formData.sortBy;
			snapshot.tags = $formData.tags;
		}
		snapshot.pageNumber = $formData.page;
	}

	function resetPage() {
		if (modified) {
			$formData.page = 1;
		} else {
			$formData.page = snapshot.pageNumber;
		}
	}

	/*
	 * This function is used to reset any modification that occurred on fields other than pageNumber to change the page related to the Pagination component.
	 */
	async function changePage() {
		if (modified) {
			$formData.dateStart = snapshot.dateStart;
			dateStartValue = snapshot.dateStart ? parseDate(snapshot.dateStart) : undefined;
			$formData.dateEnd = snapshot.dateEnd;
			dateEndValue = snapshot.dateEnd ? parseDate(snapshot.dateEnd) : undefined;
			$formData.featured = snapshot.featured;
			$formData.perPage = snapshot.perPage;
			$formData.research = snapshot.research;
			$formData.sortBy = snapshot.sortBy;
			$formData.tags = snapshot.tags;
		}

		await tick();

		saveForm();
		formRef?.requestSubmit();
	}

	const perPageOptions: number[] = [...new Set([defaultPerPage, 6, 3, 9, 12, 15])].sort((a, b) => a - b);

	const dateFormatter = new DateFormatter(page.params.locale ?? defaultLocale, {
		dateStyle: 'long'
	});

	const localTimeZone = getLocalTimeZone();
	const todayDate = today(localTimeZone);
	const calendarMinDate = new CalendarDate(2025, 1, 1);

	// Reset the snapshot when the page changes
	afterNavigate(() => saveForm(true));
</script>

<div class={cn('flex flex-col gap-5', className)}>
	<!-- Form -->
	<form
		bind:this={formRef}
		method="GET"
		class="relative grid grid-cols-6 gap-x-3 gap-y-5 md:grid-cols-8"
		onsubmit={() => saveForm()}
	>
		<!-- Research -->
		<Form.Field {form} name="research" class="col-span-4 md:col-span-7">
			<Form.Control>
				{#snippet children({ props })}
					<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
					{@const { name: _, ...rest } = props}
					<div class="form-field-item">
						<Input
							name={$formData.research && $formData.research !== '' ? 'research' : ''}
							class="rounded-2xl hover:[&_*]:cursor-text hover:opacity-75"
							placeholder="Search..."
							{...rest}
							bind:value={$formData.research}
							onchange={resetPage}
						></Input>
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>

		<!-- Submit -->
		<div class="form-field-item col-span-2 md:col-span-1">
			<Button type="submit" variant="secondary" class="w-min self-end rounded-2xl hover:cursor-pointer"
				>Apply<SearchIcon class="icon" /></Button
			>
		</div>

		<div class="col-span-6 flex flex-wrap items-center justify-evenly gap-5 md:col-span-8">
			<!-- Sort By -->
			<Form.Field {form} name="sortBy" class="order-first">
				<Form.Control>
					{#snippet children({ props })}
						<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
						{@const { name: _, ...rest } = props}
						<div class="form-field-item flex-col">
							<Form.Label class="font-bold text-nowrap">Sort By</Form.Label>
							<NativeSelect.Root
								name={$formData.sortBy && $formData.sortBy !== defaultSortBy ? 'sortBy' : ''}
								bind:value={$formData.sortBy}
								onchange={resetPage}
								{...rest}
								class="truncate rounded-2xl [&_*]:text-xs! md:[&_*]:text-sm! hover:[&_*]:cursor-pointer hover:opacity-75"
							>
								{#each sortByValues.toSorted( (a, b) => getSortByLabel(a).localeCompare(getSortByLabel(b)) ) as value (value)}
									<NativeSelect.Option {value}>{getSortByLabel(value)}</NativeSelect.Option>
								{/each}
							</NativeSelect.Root>
						</div>
					{/snippet}
				</Form.Control>
			</Form.Field>

			<!-- Date Start -->
			<Form.Field {form} name="dateStart" class="md:order-2 order-4">
				<Form.Control>
					{#snippet children({ props })}
						<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
						{@const { name: _, ...rest } = props}
						<!-- Hidden input because the date picker is inside a popover -->
						<input
							class="absolute hidden"
							name={$formData.dateStart ? 'dateStart' : ''}
							{...rest}
							bind:value={$formData.dateStart}
						/>
						<div class="form-field-item flex-col">
							<Form.Label class="font-bold text-nowrap">After</Form.Label>
							<Popover.Root>
								<Popover.Trigger
									{...props}
									class="flex items-center justify-center gap-2 truncate rounded-2xl border-1 px-2 py-1 [&_*]:text-xs! md:[&_*]:text-sm! hover:cursor-pointer hover:opacity-75 {$formData.dateStart
										? 'text-muted-foreground'
										: ''}"
								>
									<CalendarIcon class="icon opacity-50" />
									<span class="truncate">
										{dateStartValue ? dateFormatter.format(dateStartValue.toDate(localTimeZone)) : 'Pick a date'}
									</span>
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="bottom" align="center">
									<Card.Root>
										<Card.Header>
											<Card.Description class="pr-5">Search for articles published after this date.</Card.Description>
											<Card.Action>
												<Button
													size="sm"
													variant="outline"
													onclick={() => {
														updateDateStart(todayDate);
													}}>Today</Button
												>
											</Card.Action>
										</Card.Header>
										<Card.Content>
											<Calendar
												captionLayout="dropdown"
												locale={page.params.locale ?? defaultLocale}
												minValue={calendarMinDate}
												maxValue={dateEndValue ?? todayDate}
												placeholder={todayDate}
												type="single"
												bind:value={dateStartValue}
												onValueChange={updateDateStart}
											/>
										</Card.Content>
									</Card.Root>
								</Popover.Content>
							</Popover.Root>
						</div>
					{/snippet}
				</Form.Control>
			</Form.Field>

			<!-- Date End -->
			<Form.Field {form} name="dateEnd" class="md:order-3 order-5">
				<Form.Control>
					{#snippet children({ props })}
						<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
						{@const { name: _, ...rest } = props}
						<!-- Hidden input because the date picker is inside a popover -->
						<input
							class="absolute hidden"
							name={$formData.dateEnd ? 'dateEnd' : ''}
							{...rest}
							bind:value={$formData.dateEnd}
						/>
						<div class="form-field-item flex-col">
							<Form.Label class="font-bold text-nowrap">Before</Form.Label>
							<Popover.Root>
								<Popover.Trigger
									{...props}
									class="flex items-center justify-center gap-2 truncate rounded-2xl border-1 px-2 py-1 [&_*]:text-xs! md:[&_*]:text-sm! hover:cursor-pointer hover:opacity-75 {$formData.dateEnd
										? 'text-muted-foreground'
										: ''}"
								>
									<CalendarIcon class="icon opacity-50" />
									<span class="truncate">
										{dateEndValue ? dateFormatter.format(dateEndValue.toDate(localTimeZone)) : 'Pick a date'}
									</span>
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="bottom" align="center">
									<Card.Root>
										<Card.Header>
											<Card.Description class="pr-5">Search for articles published before this date.</Card.Description>
											<Card.Action>
												<Button
													size="sm"
													variant="outline"
													onclick={() => {
														updateDateEnd(todayDate);
													}}>Today</Button
												>
											</Card.Action>
										</Card.Header>
										<Card.Content>
											<Calendar
												captionLayout="dropdown"
												locale={page.params.locale ?? defaultLocale}
												minValue={$formData.dateStart ? parseDate($formData.dateStart) : calendarMinDate}
												maxValue={todayDate}
												placeholder={todayDate}
												type="single"
												bind:value={dateEndValue}
												onValueChange={updateDateEnd}
											/>
										</Card.Content>
									</Card.Root>
								</Popover.Content>
							</Popover.Root>
						</div>
					{/snippet}
				</Form.Control>
			</Form.Field>

			<!-- Tags -->
			<Form.Field {form} name="tags" class="md:order-4 order-2">
				<Form.Control>
					{#snippet children({ props })}
						<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
						{@const { name: _, ...rest } = props}
						<div class="form-field-item flex-col">
							<Form.Label class="font-bold text-nowrap">Tags</Form.Label>
							<Select.Root
								name={$formData.tags &&
								$formData.tags.length > 0 &&
								!($formData.tags.length === 1 && $formData.tags[0] === undefined)
									? 'tags'
									: ''}
								type="multiple"
								{...rest}
								bind:value={$formData.tags}
								onValueChange={resetPage}
							>
								<Select.Trigger class="truncate rounded-2xl [&_*]:text-xs! md:[&_*]:text-sm! hover:cursor-pointer hover:opacity-75">Options</Select.Trigger>
								<Select.Content class="[&_*]:text-xs! md:[&_*]:text-sm!">
									{#each tagsValues.toSorted((a, b) => getTagLabel(a).localeCompare(getTagLabel(b))) as value (value)}
										<Select.Item {value} class="hover:cursor-pointer">{getTagLabel(value)}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
					{/snippet}
				</Form.Control>
			</Form.Field>

			<!-- Featured -->
			<Form.Field {form} name="featured" class="order-3 md:order-5">
				<Form.Control>
					{#snippet children({ props })}
						<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
						{@const { name: _, ...rest } = props}
						<div class="form-field-item flex-col">
							<Form.Label class="font-bold text-nowrap">Featured</Form.Label>
							<Switch
								name={$formData.featured && $formData.featured !== defaultFeatured ? 'featured' : ''}
								{...rest}
								class="hover:cursor-pointer hover:opacity-75"
								bind:checked={$formData.featured}
								onCheckedChange={resetPage}
							/>
						</div>
					{/snippet}
				</Form.Control>
			</Form.Field>

			<!-- Per Page -->
			<Form.Field {form} name="perPage" class="order-6">
				<Form.Control>
					{#snippet children({ props })}
						<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
						{@const { name: _, ...rest } = props}
						<div class="form-field-item flex-col">
							<Form.Label class="font-bold text-nowrap">Per Page</Form.Label>
							<NativeSelect.Root
								name={$formData.perPage && $formData.perPage !== defaultPerPage ? 'perPage' : ''}
								bind:value={$formData.perPage}
								onchange={resetPage}
								{...rest}
								class="truncate rounded-2xl [&_*]:text-xs! md:[&_*]:text-sm! hover:[&_*]:cursor-pointer hover:opacity-75"
								aria-sort="ascending"
							>
								{#each perPageOptions as value (value)}
									<NativeSelect.Option {value} selected={value === defaultPerPage}>{value}</NativeSelect.Option>
								{/each}
							</NativeSelect.Root>
						</div>
					{/snippet}
				</Form.Control>
			</Form.Field>
		</div>

		<!-- Hidden field for page number, controlled by the pagination component -->
		<input
			name={$formData.page && $formData.page !== 1 ? 'page' : ''}
			bind:value={$formData.page}
			class="absolute hidden"
		/>

		<!-- Displaying the tags in the remaining columns -->
		<div class="col-span-6 flex flex-wrap items-center justify-center gap-5 md:col-span-8">
			{#if $formData.tags && $formData.tags.length > 0}
				{#each $formData.tags as tag, i (i)}
					<Badge variant="secondary" class="w-min truncate text-xs! md:text-sm!">{getTagLabel(tag)}</Badge>
				{/each}
			{/if}
		</div>
	</form>

	<div class={cn('relative', childrenClass)}>
		{@render children?.()}
	</div>

	{#if itemsCount > 0 && itemsCount / $formData.perPage > 1}
		<Pagination.Root
			count={itemsCount}
			perPage={$formData.perPage}
			bind:page={$formData.page}
			onPageChange={changePage}
		>
			{#snippet children({ pages, currentPage })}
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.PrevButton>
							<ChevronLeftIcon class="icon" />
						</Pagination.PrevButton>
					</Pagination.Item>
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
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
							<ChevronRightIcon class="icon" />
						</Pagination.NextButton>
					</Pagination.Item>
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	{/if}
</div>

<style>
	.form-field-item {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: calc(var(--spacing) * 3);
		height: 100%;
	}
</style>
