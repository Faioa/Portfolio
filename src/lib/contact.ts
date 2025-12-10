import { z } from 'zod';

export const categories = {
	'flux-studio': 'Flux Studio',
	job: 'Job Opportunities',
	website: 'Website',
	other: 'Other'
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
	],
	['other', {}]
]);

export const minContent = 50;
export const maxContent = 3000;

export const contactSchema = z.object({
	firstName: z.string().trim().min(2).max(50),
	lastName: z.string().trim().min(2).max(50),
	email: z.email().trim().max(254),
	category: z
		.string()
		.trim()
		.refine((val) => val in categories, 'Please select a valid category.'),
	subject: z.string().trim().min(5).max(100),
	content: z.string().trim().min(minContent).max(maxContent)
});
