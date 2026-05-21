<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import { cn } from '$lib/utils';

	interface Props {
		orientation?: 'horizontal' | 'vertical';
		onSelect?: () => void;
		class?: string;
	}

	const { orientation = 'horizontal', onSelect = () => {}, class: className }: Props = $props();
</script>

<div class={cn('', className)}>
	<NavigationMenu.Root class="relative h-full w-full" {orientation}>
		<NavigationMenu.List class={orientation === 'horizontal' ? '' : 'flex-col gap-5'}>
			<NavigationMenu.Item>
				<NavigationMenu.Link {onSelect}>
					{#snippet child({ props })}
						<Link href="/" class={cn(buttonVariants({ variant: 'ghost' }), 'text-xl!')} {...props}>Home</Link>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<NavigationMenu.Link {onSelect}>
					{#snippet child({ props })}
						<Link href="/articles" class={cn(buttonVariants({ variant: 'ghost' }), 'text-xl!')} {...props}
							>Articles</Link
						>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<NavigationMenu.Link {onSelect}>
					{#snippet child({ props })}
						<Link href="/projects" class={cn(buttonVariants({ variant: 'ghost' }), 'text-xl!')} {...props}
							>Projects</Link
						>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<NavigationMenu.Link {onSelect}>
					{#snippet child({ props })}
						<Link href="/contact" class={cn(buttonVariants({ variant: 'ghost' }), 'text-xl!')} {...props}>Contact</Link>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<NavigationMenu.Link {onSelect}>
					{#snippet child({ props })}
						<Link href="/about" class={cn(buttonVariants({ variant: 'ghost' }), 'text-xl!')} {...props}>About</Link>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>
</div>
