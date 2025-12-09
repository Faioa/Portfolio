import { z } from 'zod';

export const categories = {
	'flux-studio': 'Flux Studio',
	job: 'Job Opportunities',
	website: 'Website',
	other: 'Other (please specify)'
} as Record<string, string>;

export const subjects = new Map<string, Record<string, string>>([
	[
		'flux-studio',
		{
			'bug-report': 'Bug Report',
			suggestion: 'Suggestion',
			feedback: 'Feedback',
			other: 'Other'
		}
	],
	[
		'job',
		{
			offer: 'Job Offer',
			cv: 'Curriculum Vitæ',
			other: 'Other'
		}
	],
	[
		'website',
		{
			'bug-report': 'Bug Report',
			suggestion: 'Suggestion',
			feedback: 'Feedback',
			other: 'Other'
		}
	]
]);

export const contactSchema = z.object({
	firstName: z.string().trim().min(2),
	lastName: z.string().trim().min(2),
	email: z.email().trim(),
	category: z
		.string()
		.trim()
		.refine((val) => val in categories, 'Please select a valid category.'),
	subject: z.string().trim().min(5),
	content: z.string().trim().min(50)
});
