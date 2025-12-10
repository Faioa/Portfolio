import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { contactSchema } from '$lib/contact';

import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async () => {
	const form = await superValidate(zod4(contactSchema));

	return { form };
};
