import type { ListItem } from "$lib/interfaces/lists";

export const createListItem =
	(listId: string) => (value: string): ListItem => ({ value, list: listId });
