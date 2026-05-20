<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import { cn } from '$lib/utils';

	interface Props {
		orientation?: 'horizontal' | 'vertical';
		class?: string;
	}

	const { orientation = 'horizontal', class: className }: Props = $props();
</script>

<div class={cn('', className)}>
	<NavigationMenu.Root class="relative h-full w-full" {orientation}>
		<NavigationMenu.List class={orientation === 'horizontal' ? '' : 'flex-col gap-5'}>
			<NavigationMenu.Item>
				<NavigationMenu.Link>
					{#snippet child()}
						<Link href="/" class={cn(buttonVariants({ variant: 'ghost' }), 'text-xl!')}>Home</Link>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<NavigationMenu.Link>
					{#snippet child()}
						<Link href="/articles" class={cn(buttonVariants({ variant: 'ghost' }), 'text-xl!')}>Articles</Link>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<NavigationMenu.Link>
					{#snippet child()}
						<Link href="/projects" class={cn(buttonVariants({ variant: 'ghost' }), 'text-xl!')}>Projects</Link>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<NavigationMenu.Link>
					{#snippet child()}
						<Link href="/contact" class={cn(buttonVariants({ variant: 'ghost' }), 'text-xl!')}>Contact</Link>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<NavigationMenu.Link>
					{#snippet child()}
						<Link href="/about" class={cn(buttonVariants({ variant: 'ghost' }), 'text-xl!')}>About</Link>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>
</div>
