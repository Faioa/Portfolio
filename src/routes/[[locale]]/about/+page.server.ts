import { defaultLocale } from '$lib/lang';

import type { PageServerLoad } from './$types';

const available = import.meta.glob('$lib/assets/cv/*.pdf', {
	eager: true,
	query: '?url',
	import: 'default'
});

export const load: PageServerLoad = async ({ params }) => {
	const lang = params.locale ?? defaultLocale;
	return { cv: available[`/src/lib/assets/cv/${lang}.pdf`] ?? null };
};
