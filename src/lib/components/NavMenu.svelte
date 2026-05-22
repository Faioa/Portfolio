<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';

	import Link from '$lib/components/Link.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import { cn } from '$lib/utils';

	interface Props {
		orientation?: 'horizontal' | 'vertical';
		class?: string;
	}

	const { orientation = 'horizontal', class: className }: Props = $props();

	// Actual routes' ids are used to determine the active state simply
	const values = {
		home: '/[[locale=lang]]',
		articles: '/[[locale=lang]]/articles',
		projects: '/[[locale=lang]]/projects',
		contact: '/[[locale=lang]]/contact',
		about: '/[[locale=lang]]/about'
	};

	function isActive(v: string) {
		return value === v;
	}

	let value = $state(browser ? (page.route.id ?? '') : '');
</script>

<div class={cn('', className)}>
	<NavigationMenu.Root class="relative h-full w-full" {orientation} bind:value>
		<NavigationMenu.List class={orientation === 'horizontal' ? '' : 'flex-col gap-5'}>
			<NavigationMenu.Item value={values.home}>
				<NavigationMenu.Link active={isActive(values.home)}>
					{#snippet child({ props })}
						<Link href="/" class={cn(buttonVariants({ variant: 'ghost' }), 'text-xl!')} {...props}>Home</Link>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item value={values.articles}>
				<NavigationMenu.Link active={isActive(values.articles)}>
					{#snippet child({ props })}
						<Link href="/articles" class={cn(buttonVariants({ variant: 'ghost' }), 'text-xl!')} {...props}
							>Articles</Link
						>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item value={values.projects}>
				<NavigationMenu.Link active={isActive(values.projects)}>
					{#snippet child({ props })}
						<Link href="/projects" class={cn(buttonVariants({ variant: 'ghost' }), 'text-xl!')} {...props}
							>Projects</Link
						>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item value={values.contact}>
				<NavigationMenu.Link active={isActive(values.contact)}>
					{#snippet child({ props })}
						<Link href="/contact" class={cn(buttonVariants({ variant: 'ghost' }), 'text-xl!')} {...props}>Contact</Link>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item value={values.about}>
				<NavigationMenu.Link active={isActive(values.about)}>
					{#snippet child({ props })}
						<Link href="/about" class={cn(buttonVariants({ variant: 'ghost' }), 'text-xl!')} {...props}>About</Link>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>
</div>
