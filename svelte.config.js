import { transformerNotationDiff } from '@shikijs/transformers';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { wuchale } from '@wuchale/vite-plugin';
import { escapeSvelte, mdsvex } from 'mdsvex';
import { dirname, join } from 'path';
import { visit } from 'unist-util-visit';
import { fileURLToPath } from 'url';

import { highlighter, theme } from './src/lib/server/shiki-theme.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function rehypeCodeBlock() {
	return (tree) => {
		visit(tree, 'raw', (node, index, parent) => {
			const html = node.value;

			if (html.includes('<pre') && html.includes('class="shiki')) {
				const filename = html.match(/data-filename="([^"]*)"/)?.[1] ?? '';
				const lang = html.match(/data-language="([^"]*)"/)?.[1] ?? 'text';
				const showLinesNumber = html.match(/data-sow-lines-number="([^"]*)"/)?.[1] ?? 'false';

				const codeBlockNode = {
					type: 'element',
					tagName: 'CodeBlock',
					properties: {
						lang,
						filename,
						showLinesNumber
					},
					children: [
						{
							type: 'raw',
							value: html
						}
					]
				};

				if (parent && index !== undefined) {
					parent.children[index] = codeBlockNode;
				}
			}
		});
	};
}

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	layout: {
		_: join(__dirname, './src/lib/layouts/ArticleLayout.svelte')
	},
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

			return html
				.replace(/\s+tabindex="[^"]*"/, '')
				.replace(
					/<pre([^>]*)>/,
					`<pre$1 data-language="${lang}" data-filename="${filename}" data-show-lines-number="${showLinesNumber}">`
				);
		},
		alias: { js: 'javascript', ts: 'typescript' }
	},
	rehypePlugins: [rehypeCodeBlock],
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
