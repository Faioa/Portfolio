import { transformerNotationDiff } from '@shikijs/transformers';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { wuchale } from '@wuchale/vite-plugin';
import { escapeSvelte, mdsvex } from 'mdsvex';

import { highlighter, theme } from './src/lib/server/shiki-theme.ts';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	highlight: {
		highlighter: async (code, lang = 'text', meta) => {
			const html = escapeSvelte(
				highlighter.codeToHtml(code, {
					lang,
					theme,
					transformers: [
						transformerNotationDiff({
							matchAlgorithm: 'v3'
						})
					]
				})
			);

			const filename = meta?.match(/filename="([^"]+)"/)?.[1];

			const showLinesNumber = meta?.includes('showLinesNumber');

			const codeCopy = escapeSvelte(code);

			return `<CodeBlock code={\`${html}\`} codeCopy={\`${codeCopy}\`} lang="${lang}" ${filename ? `filename="${filename}"` : ''} ${showLinesNumber ? `showLinesNumber=true` : ''} />`;
		},
		alias: { js: 'javascript', ts: 'typescript' }
	},
	extensions: ['.svx']
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [mdsvex(mdsvexOptions), vitePreprocess()],
	kit: {
		adapter: adapter(),
		prerender: { entries: ['*'] }
	},
	extensions: ['.svelte', '.svx'],
	plugins: [wuchale()]
};

export default config;
