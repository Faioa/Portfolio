<script lang="ts">
	import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import SearchIcon from '@lucide/svelte/icons/search';
	import type { FsSuperForm } from 'formsnap';

	import { type Snippet, tick } from 'svelte';

	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';

	import {
		type SortBy,
		type Tag,
		defaultPerPage,
		defaultSortBy,
		getSortByLabel,
		getTagLabel,
		sortByValues,
		tagsValues
	} from '$lib/articles-types';
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
		dateStart?: string;
		dateEnd?: string;
		featured?: boolean;
		itemsCount?: number;
		page?: number;
		perPage?: number;
		research?: string;
		sortBy?: SortBy;
		tags?: Tag[];
		form: FsSuperForm<Record<string, unknown>, unknown>;
		class?: string;
		childrenClass?: string;
		children?: Snippet;
	}

	let {
		itemsCount = $bindable(0),
		dateStart = $bindable(),
		dateEnd = $bindable(),
		featured = $bindable(false),
		page: pageNumber = $bindable(1),
		perPage = $bindable(defaultPerPage),
		research = $bindable(),
		sortBy = $bindable(defaultSortBy),
		tags = $bindable(),
		form = $bindable(),
		class: className = '',
		childrenClass = '',
		children
	}: Props = $props();

	let formRef: HTMLFormElement | null | undefined = $state(null);

	let snapshot = $state({
		dateStart,
		dateEnd,
		featured,
		pageNumber,
		perPage,
		research,
		sortBy,
		tags
	});

	const modified = $derived(
		!(
			dateStart === snapshot.dateStart &&
			dateEnd === snapshot.dateEnd &&
			featured === snapshot.featured &&
			perPage === snapshot.perPage &&
			research === snapshot.research &&
			sortBy === snapshot.sortBy &&
			arrayCompare(tags, snapshot.tags)
		)
	);

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
	 * This function is used to submit the form programmatically. It updates the snapshot to keep the data consistent between two submits.
	 */
	function saveForm(force: boolean = false) {
		if (modified || force) {
			snapshot.dateStart = dateStart;
			snapshot.dateEnd = dateEnd;
			snapshot.featured = featured;
			snapshot.perPage = perPage;
			snapshot.research = research;
			snapshot.sortBy = sortBy;
			snapshot.tags = tags;
		}
		snapshot.pageNumber = pageNumber;
	}

	function resetPage() {
		if (modified) {
			pageNumber = 1;
		} else {
			pageNumber = snapshot.pageNumber;
		}
	}

	/*
	 * This function is used to reset any modification that occurred on fields other than pageNumber to change the page related to the Pagination component.
	 */
	async function changePage() {
		if (modified) {
			dateStart = snapshot.dateStart;
			dateEnd = snapshot.dateEnd;
			featured = snapshot.featured;
			perPage = snapshot.perPage;
			research = snapshot.research;
			sortBy = snapshot.sortBy;
			tags = snapshot.tags;
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

	afterNavigate(() => saveForm(true));
</script>

<div class={cn('flex flex-col gap-5', className)}>
	{pageNumber}
	{snapshot.pageNumber}
	{modified}
	<!-- Form -->
	<form
		bind:this={formRef}
		method="GET"
		class="relative grid grid-cols-6 gap-x-3 gap-y-5 md:grid-cols-8"
		onsubmit={() => saveForm()}
	>
		<!-- Research -->
		<Form.Field {form} name={research && research !== '' ? 'research' : ''} class="col-span-4 md:col-span-7">
			<Form.Control>
				{#snippet children({ props })}
					<div class="form-field-item">
						<Input class="rounded-2xl" placeholder="Search..." {...props} bind:value={research} onchange={resetPage}
						></Input>
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>

		<!-- Submit -->
		<div class="form-field-item col-span-2 md:col-span-1">
			<Button type="submit" variant="secondary" class="w-min self-end rounded-2xl"
				>Apply<SearchIcon class="icon" /></Button
			>
		</div>

		<div class="col-span-6 flex flex-wrap items-center justify-evenly gap-5 md:col-span-8 md:flex-nowrap">
			<!-- Sort By -->
			<Form.Field {form} name={sortBy && sortBy !== defaultSortBy ? 'sortBy' : ''}>
				<Form.Control>
					{#snippet children({ props })}
						<div class="form-field-item flex-col md:flex-row">
							<Form.Label class="font-bold text-nowrap">Sort By</Form.Label>
							<NativeSelect.Root
								bind:value={sortBy}
								onchange={resetPage}
								{...props}
								class="truncate rounded-2xl [&_*]:text-xs! md:[&_*]:text-sm!"
							>
								{#each sortByValues.toSorted( (a, b) => getSortByLabel(a).localeCompare(getSortByLabel(b)) ) as value (value)}
									<NativeSelect.Option {value}>{getSortByLabel(value)}</NativeSelect.Option>
								{/each}
							</NativeSelect.Root>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Date Start -->
			<Form.Field {form} name={dateStart ? 'dateStart' : ''}>
				<Form.Control>
					{#snippet children({ props })}
						<!-- Hidden input because the date picker is inside a popover -->
						<input class="absolute hidden" {...props} bind:value={dateStart} onchange={resetPage} />
						<div class="form-field-item flex-col md:flex-row">
							<Form.Label class="font-bold text-nowrap">After</Form.Label>
							<Popover.Root>
								<Popover.Trigger
									{...props}
									class="flex items-center justify-center gap-2 truncate rounded-2xl border-1 px-2 py-1 [&_*]:text-xs! md:[&_*]:text-sm! {dateStart
										? 'text-muted-foreground'
										: ''}"
								>
									<CalendarIcon class="icon opacity-50" />
									<span class="truncate">
										{dateStart ? dateFormatter.format(parseDate(dateStart).toDate(localTimeZone)) : 'Pick a date'}
									</span>
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="bottom" align="center">
									<Card.Root>
										<Card.Header>
											<Card.Description>Search for articles published after this date.</Card.Description>
											<Card.Action>
												<Button
													size="sm"
													variant="outline"
													onclick={() => {
														if (!dateEnd || todayDate <= parseDate(dateEnd)) dateStart = todayDate.toString();
													}}>Today</Button
												>
											</Card.Action>
										</Card.Header>
										<Card.Content>
											<Calendar
												captionLayout="dropdown"
												locale={page.params.locale ?? defaultLocale}
												minValue={calendarMinDate}
												maxValue={dateEnd ? parseDate(dateEnd) : todayDate}
												placeholder={todayDate}
												type="single"
												value={dateStart ? parseDate(dateStart) : undefined}
												onValueChange={(value) => {
													dateStart = value?.toString();
													if (dateEnd && value && parseDate(dateEnd) < value) dateEnd = undefined;
												}}
											/>
										</Card.Content>
									</Card.Root>
								</Popover.Content>
							</Popover.Root>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Date End -->
			<Form.Field {form} name={dateEnd ? 'dateEnd' : ''}>
				<Form.Control>
					{#snippet children({ props })}
						<!-- Hidden input because the date picker is inside a popover -->
						<input class="absolute hidden" {...props} bind:value={dateEnd} onchange={resetPage} />
						<div class="form-field-item flex-col md:flex-row">
							<Form.Label class="font-bold text-nowrap">Before</Form.Label>
							<Popover.Root>
								<Popover.Trigger
									{...props}
									class="flex items-center justify-center gap-2 truncate rounded-2xl border-1 px-2 py-1 [&_*]:text-xs! md:[&_*]:text-sm! {dateEnd
										? 'text-muted-foreground'
										: ''}"
								>
									<CalendarIcon class="icon opacity-50" />
									<span class="truncate">
										{dateEnd ? dateFormatter.format(parseDate(dateEnd).toDate(localTimeZone)) : 'Pick a date'}
									</span>
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="bottom" align="center">
									<Card.Root>
										<Card.Header>
											<Card.Description>Search for articles published before this date.</Card.Description>
											<Card.Action>
												<Button
													size="sm"
													variant="outline"
													onclick={() => {
														dateEnd = today(getLocalTimeZone()).toString();
													}}>Today</Button
												>
											</Card.Action>
										</Card.Header>
										<Card.Content>
											<Calendar
												captionLayout="dropdown"
												locale={page.params.locale ?? defaultLocale}
												minValue={dateStart ? parseDate(dateStart) : calendarMinDate}
												maxValue={todayDate}
												placeholder={todayDate}
												type="single"
												value={dateEnd ? parseDate(dateEnd) : undefined}
												onValueChange={(value) => {
													dateEnd = value?.toString();
													if (dateStart && value && value < parseDate(dateStart)) dateStart = undefined;
												}}
											/>
										</Card.Content>
									</Card.Root>
								</Popover.Content>
							</Popover.Root>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Tags -->
			<Form.Field {form} name={tags && tags.length > 0 && !(tags.length === 1 && tags[0] === undefined) ? 'tags' : ''}>
				<Form.Control>
					{#snippet children({ props })}
						<div class="form-field-item flex-col md:flex-row">
							<Form.Label class="font-bold text-nowrap">Tags</Form.Label>
							<Select.Root type="multiple" {...props} bind:value={tags} onValueChange={resetPage}>
								<Select.Trigger class="truncate rounded-2xl [&_*]:text-xs! md:[&_*]:text-sm!">Options</Select.Trigger>
								<Select.Content class="[&_*]:text-xs! md:[&_*]:text-sm!">
									{#each tagsValues.toSorted((a, b) => getTagLabel(a).localeCompare(getTagLabel(b))) as value (value)}
										<Select.Item {value}>{getTagLabel(value)}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Featured -->
			<Form.Field {form} name={featured && featured !== defaultFeatured ? 'featured' : ''}>
				<Form.Control>
					{#snippet children({ props })}
						<div class="form-field-item flex-col md:flex-row">
							<Form.Label class="font-bold text-nowrap">Featured</Form.Label>
							<Switch {...props} bind:checked={featured} onCheckedChange={resetPage} />
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Per Page -->
			<Form.Field {form} name={perPage && perPage !== defaultPerPage ? 'perPage' : ''}>
				<Form.Control>
					{#snippet children({ props })}
						<div class="form-field-item flex-col md:flex-row">
							<Form.Label class="font-bold text-nowrap">Per Page</Form.Label>
							<NativeSelect.Root
								bind:value={perPage}
								onchange={resetPage}
								{...props}
								class="truncate rounded-2xl [&_*]:text-xs! md:[&_*]:text-sm!"
								aria-sort="ascending"
							>
								{#each perPageOptions as value (value)}
									<NativeSelect.Option {value} selected={value === defaultPerPage}>{value}</NativeSelect.Option>
								{/each}
							</NativeSelect.Root>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<!-- Hidden field for page number, controlled by the pagination component -->
		<input
			name={pageNumber && pageNumber !== 1 ? 'page' : ''}
			bind:value={pageNumber}
			class="absolute hidden"
			onchange={resetPage}
		/>

		<!-- Displaying the tags in the remaining columns -->
		<div class="col-span-6 flex flex-wrap items-center justify-center gap-5 md:col-span-8">
			{#if tags && tags.length > 0}
				{#each tags as tag, i (i)}
					<Badge variant="secondary" class="w-min truncate text-xs! md:text-sm!">{getTagLabel(tag)}</Badge>
				{/each}
			{/if}
		</div>
	</form>

	<div class={cn('relative', childrenClass)}>
		{@render children?.()}
	</div>

	{#if itemsCount > 0 && itemsCount / perPage > 1}
		<Pagination.Root count={itemsCount} {perPage} bind:page={pageNumber} onPageChange={changePage}>
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
