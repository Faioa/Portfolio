import { z } from 'zod';

export const categories = {
	'flux-studio': 'Flux Studio',
	job: 'Job Opportunities',
	website: 'Website',
	other: 'Other (please specify)'
} as Record<string, string>;

export const subjects = new Map<string, Record<string, string>>([
	['flux-studio', {}],
	['job', {}],
	['website', {}]
]);

export const contactSchema = z
	.object({
		firstName: z.string().trim().min(2),
		lastName: z.string().trim().min(2),
		email: z.email().trim(),
		category: z
			.string()
			.trim()
			.refine((val) => val in categories, 'Please select a valid category.'),
		subject: z.nullish(z.string().trim()),
		other: z.nullish(z.string().trim().min(5)),
		content: z.string().trim().min(50)
	})
	.superRefine((data, ctx) => {
		// The field 'other' is required to specify the subject if the category is 'other'
		if (data.category in categories) {
			if (data.subject === 'other') {
				if (!data.other?.trim()) {
					ctx.addIssue({
						code: 'invalid_value',
						origin: 'string',
						message: 'Please specify the subject of your message.',
						path: ['other'],
						values: [data.other]
					});
				}
			} else {
				// Verifying that the subject is correct if the category is not 'other'
				if (!data.subject) {
					ctx.addIssue({
						code: 'invalid_value',
						origin: 'string',
						message: 'Please specify the subject of your message.',
						path: ['subject'],
						values: [data.subject]
					});
				} else if (!(data.subject in subjects.get(data.category)!)) {
					ctx.addIssue({
						code: 'invalid_value',
						origin: 'string',
						message: 'Please select a valid subject for your message.',
						path: ['subject'],
						values: [data.subject]
					});
				}
			}
		}
	});
