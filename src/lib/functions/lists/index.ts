import type { ListItem } from "./db/interfaces";

export const createListItem =
	(listId: string) => (value: string): ListItem => ({ value, list: listId });
