import { defaultLocale } from '$lib/lang';

import type { PageServerLoad } from './$types';

const available = import.meta.glob('$lib/assets/cv/*', { eager: true });

export const load: PageServerLoad = async ({ params }) => {
	let lang = params.locale ?? defaultLocale;

	if (!(`/src/lib/assets/cv/${lang}.pdf` in available)) {
		if (lang === defaultLocale || !(`/src/lib/assets/cv/${defaultLocale}.pdf` in available)) {
			return { cv: null };
		}
		lang = defaultLocale;
	}

	return { cv: `/src/lib/assets/cv/${lang}.pdf` };
};
