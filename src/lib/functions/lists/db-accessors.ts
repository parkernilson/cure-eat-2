import type { ListItem, ListItemModel, ListModel, ListWithItems } from '$lib/interfaces/lists';
import { toError } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as B from 'fp-ts/lib/boolean';
import { pipe } from 'fp-ts/lib/function';
import type Client from 'pocketbase';

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
	pipe(
		listId === item.list, 
		B.fold(
			() => TE.left(new Error(`List id ${listId} does not match item list id ${item.list}`)),
			() => TE.tryCatch(() => pb.collection('list_items').create(item), toError)
		)
	);

export const addItemToListCurried = (pb: Client) => (listId: string) => (item: ListItem) =>
	addItemToList(pb, listId, item);
