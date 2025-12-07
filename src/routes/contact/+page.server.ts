import { error, fail } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { contactSchema } from '$lib/contact';

import type { Actions, PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(contactSchema));

	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(contactSchema));

		if (!form.valid) return fail(400, { form });

		// Post mail via resend

		return message(form, 'Your message was posted successfully!');
	}
} satisfies Actions;
