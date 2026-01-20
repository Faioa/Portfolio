// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { EMAIL, RESEND_API_KEY } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { Resend } from 'resend';

import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { contactSchema, getCategoryLabel, getSubjectLabel } from '$lib/contact';

import type { Actions } from './$types';

export const prerender = false;

const resend = new Resend(RESEND_API_KEY);

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(contactSchema));

		if (!form.valid) return fail(400, { form });

		if (!EMAIL || !RESEND_API_KEY)
			return fail(501, {
				form,
				message: 'This service was not configured correctly. Please wait try again later.'
			});

		const htmlContent = form.data.content
			.split('\n\n')
			.map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
			.join('');

		const { error } = await resend.emails.send({
			from: EMAIL,
			to: [EMAIL],
			subject: `${form.data.firstName} ${form.data.lastName} : ${getCategoryLabel(form.data.category)} - ${getSubjectLabel(form.data.subject)}`,
			html: `
			<p><strong>Sender</strong> : ${form.data.firstName} - ${form.data.lastName}</p>
			<p><strong>Email</strong> : ${form.data.email}</p>
			<hr/>
			${htmlContent}`
		});

		if (error) {
			console.error(error.statusCode, error.name, error.message);
			return fail(500, {
				form,
				message: 'An error occurred on the server while trying to send your message. Please wait try again later.'
			});
		}

		return message(form, 'Your message was posted successfully!');
	}
} satisfies Actions;
