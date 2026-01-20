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
export const categoriesValues = Object.keys(categoriesSubjects) as Category[];

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
	firstName: z.string().trim().min(2).max(50),
	lastName: z.string().trim().min(2).max(50),
	email: z.email().trim().max(254),
	category: z.enum(Object.keys(categoriesSubjects) as [Category]),
	subject: z.string().trim().min(5).max(100),
	content: z.string().trim().min(minContent).max(maxContent)
});
