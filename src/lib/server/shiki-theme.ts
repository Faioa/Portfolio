import { type BundledLanguage, type ThemeRegistration, createHighlighter } from 'shiki';

export const theme: ThemeRegistration = {
	name: 'custom-theme',
	displayName: 'Custom Theme',
	colors: {
		'editor.background': 'var(--shiki-background)',
		'editor.foreground': 'var(--shiki-foreground)'
	},
	tokenColors: [
		{
			scope: ['comment', 'punctuation.definition.comment'],
			settings: {
				fontStyle: 'italic',
				foreground: 'var(--shiki-comment)'
			}
		},
		{
			scope: ['keyword', 'keyword.control', 'keyword.operator', 'storage.type', 'storage.modifier'],
			settings: {
				foreground: 'var(--shiki-keyword)'
			}
		},
		{
			scope: ['string', 'constant.other.symbol', 'constant.character', 'punctuation.definition.string'],
			settings: {
				foreground: 'var(--shiki-string)',
				fontStyle: 'italic'
			}
		},
		{
			scope: ['variable.other.constant', 'constant.numeric', 'constant.language'],
			settings: {
				foreground: 'var(--shiki-constant)'
			}
		},
		{
			scope: ['entity.name.function', 'support.function'],
			settings: {
				foreground: 'var(--shiki-function)'
			}
		},
		{
			scope: ['entity.name.type', 'support.type', 'support.class'],
			settings: {
				foreground: 'var(--shiki-type)'
			}
		},
		{
			scope: ['entity.other.attribute-name'],
			settings: {
				foreground: 'var(--shiki-attribute)'
			}
		},
		{
			scope: ['punctuation', 'meta.brace', 'meta.delimiter'],
			settings: {
				foreground: 'var(--shiki-base-code)'
			}
		},
		{
			scope: ['variable', 'identifier'],
			settings: {
				foreground: 'var(--shiki-base-code)'
			}
		}
	]
};

export const highlighter = await createHighlighter({
	themes: [theme],
	langs: [
		'javascript',
		'js',
		'typescript',
		'ts',
		'svelte',
		'html',
		'css',
		'shell',
		'rust',
		'bash',
		'dotenv',
		'text'
	] as BundledLanguage[]
});
