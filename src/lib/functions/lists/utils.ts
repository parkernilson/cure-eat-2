import type { ListItem } from "$lib/interfaces/lists";

export const createListItemObject =
	(listId: string) => (value: string): ListItem => ({ value, list: listId });
