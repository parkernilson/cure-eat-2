import * as TE from 'fp-ts/lib/TaskEither';
import type { ListItem, ListItemModel, ListModel, ListWithItems } from '$lib/lists/db/interfaces';
import { pipe } from 'fp-ts/lib/function';
import type Client from 'pocketbase';
import { toError } from 'fp-ts/lib/Either';

export const getList = (pb: Client, listId: string) =>
	TE.tryCatch(() => pb.collection('lists').getOne<ListModel>(listId), toError);

export const getListCurried = (pb: Client) => (listId: string) => getList(pb, listId);

export const getListItems = (pb: Client, listId: string) =>
	TE.tryCatch(
		() => pb.collection('list_items').getFullList<ListItemModel>({ filter: `list = '${listId}'` }),
		toError
	);

export const getListItemsCurried = (pb: Client) => (listId: string) => getListItems(pb, listId);

export const getListWithItems = (pb: Client, listId: string) =>
	pipe(
		TE.Do,
		TE.bind('list', () => getList(pb, listId)),
		TE.bind('items', () => getListItems(pb, listId)),
		TE.map(({ list, items }): ListWithItems => ({ ...list, items }))
	);

export const getListWithItemsCurried = (pb: Client) => (listId: string) =>
	getListWithItems(pb, listId);

/**
 * Get all lists belonging to the logged in user
 * @param pb
 * @returns
 */
export const getAllLists = (pb: Client) =>
	TE.tryCatch(() => pb.collection('lists').getFullList<ListModel>(), toError);

export const addItemToList = (pb: Client, listId: string, item: ListItem) =>
	listId === item.list
		? TE.tryCatch(() => pb.collection('list_items').create(item), toError)
		: TE.left(new Error(`List id ${listId} does not match item list id ${item.list}`));

export const addItemToListCurried = (pb: Client) => (listId: string) => (item: ListItem) =>
	addItemToList(pb, listId, item);
