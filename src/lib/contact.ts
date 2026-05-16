import { z } from 'zod';

export const categoriesSubjects = {
	'flux-studio': ['bug-report', 'suggestion', 'feedback', 'other'],
	job: ['offer', 'cv', 'other'],
	website: ['bug-report', 'suggestion', 'feedback', 'other'],
	other: []
} as const;

export type Category = keyof typeof categoriesSubjects;
export type Subject =
	| (typeof categoriesSubjects)['flux-studio'][number]
	| (typeof categoriesSubjects)['job'][number]
	| (typeof categoriesSubjects)['website'][number];

export const categories: Category[] = Object.keys(categoriesSubjects) as Category[];

// Utility function to include labels' translation with Wuchale
export function getCategoryLabel(value: Category): string {
	if (value === 'flux-studio') return 'Flux Studio';
	if (value === 'job') return 'Job Opportunities';
	if (value === 'website') return 'Website';
	else return 'Other';
}

// Utility function to include labels' translation with Wuchale
export function getSubjectLabel(value: Subject | string): string {
	if (value === 'bug-report') return 'Bug Report';
	else if (value === 'suggestion') return 'Suggestion';
	else if (value === 'feedback') return 'Feedback';
	else if (value === 'offer') return 'Job Offer';
	else if (value === 'cv') return 'Curriculum Vitæ';
	else if (value === 'other') return 'Other';
	else return value;
}

export const minContent = 50;
export const maxContent = 3000;
export const contactSchema = z.object({
	firstName: z
		.string()
		.trim()
		.min(1, { error: () => 'Should not be empty' })
		.max(100, { error: () => `Maximum ${100} chars` }),
	lastName: z
		.string()
		.trim()
		.min(1, { error: () => 'Should not be empty' })
		.max(100, { error: () => `Maximum ${100} chars` }),
	email: z
		.email({ error: () => 'Invalid email address format' })
		.trim()
		.max(254, { error: () => `Maximum ${254} chars` }),
	category: z.enum(categories, { error: () => 'Invalid category' }),
	subject: z
		.string()
		.trim()
		.min(2, { error: () => `Minimum ${2} chars` })
		.max(100, { error: () => `Maximum ${100} chars` }),
	content: z
		.string()
		.trim()
		.min(minContent, { error: () => `Minimum ${minContent} chars` })
		.max(maxContent, { error: () => `Maximum ${maxContent} chars` })
});

export type ContactSchema = typeof contactSchema;
