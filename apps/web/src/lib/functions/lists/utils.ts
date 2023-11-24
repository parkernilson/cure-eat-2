import type { ListItem } from '$lib/interfaces/lists';

export const createDefaultListItemObject =
	(listId: string) =>
	({value, ordinal}: {value: string, ordinal: number}): ListItem => ({ 
		list: listId, 
		value, 
		ordinal, 
		checked: false 
	});
