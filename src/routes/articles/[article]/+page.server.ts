import { getIds } from '$lib/server/articles';

import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => {
	return getIds().ids.map((value) => {
		return { article: value };
	});
};
