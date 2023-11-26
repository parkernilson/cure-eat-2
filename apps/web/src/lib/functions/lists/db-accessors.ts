import type {
	ListItem,
	ListRecord,
	ListItemRecord,
	ListWithItemsRecord,
	List
} from '$lib/interfaces/lists';
import { toError } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as B from 'fp-ts/lib/boolean';
import { pipe } from 'fp-ts/lib/function';
import type Client from 'pocketbase';

export const getList = (pb: Client, listId: string) =>
	TE.tryCatch(() => pb.collection('lists').getOne<ListRecord>(listId), toError);

export const getListItems = (pb: Client, listId: string) =>
	TE.tryCatch(
		() => pb.collection('list_items').getFullList<ListItemRecord>({ filter: `list = '${listId}'` }),
		toError
	);

export const getListWithItems = (pb: Client, listId: string) =>
	pipe(
		TE.tryCatch(
			() => pb.collection('lists').getOne(listId, { expand: 'list_items(list)' }),
			toError
		),
		TE.map(
			({ expand, ...list }) =>
				({
					...list,
					items: expand ? expand['list_items(list)'] : []
				} as ListWithItemsRecord)
		)
	);

/**
 * Get all lists belonging to the logged in user
 * @param pb
 * @returns
 */
export const getAllLists = (pb: Client) =>
	TE.tryCatch(() => pb.collection('lists').getFullList<ListRecord>(), toError);

export const getAllListsWithItems = (pb: Client) =>
	pipe(
		TE.tryCatch(
			() =>
				pb.collection('lists').getFullList<ListWithItemsRecord>({
					expand: 'list_items(list)'
				}),
			toError
		),
		TE.map((lists) =>
			lists.map(
				({ expand, ...list }) =>
					({
						...list,
						items: expand ? expand['list_items(list)'] : []
					} as ListWithItemsRecord)
			)
		)
	);

export const createList = (pb: Client) => (owner: string) => (list: Omit<List, 'owner'>) =>
	TE.tryCatch(() => pb.collection('lists').create<ListRecord>({ ...list, owner }), toError);

export const deleteList = (pb: Client) => (listId: string) =>
	TE.tryCatch(() => pb.collection('lists').delete(listId), toError);

export const addItemToList = (pb: Client, listId: string, item: ListItem) =>
	pipe(
		listId === item.list,
		B.fold(
			() => TE.left(new Error(`List id ${listId} does not match item list id ${item.list}`)),
			() => TE.tryCatch(() => pb.collection('list_items').create<ListItemRecord>(item), toError)
		)
	);

export const updateItem = (pb: Client) => (itemId: string) => (item: Partial<ListItem>) =>
	TE.tryCatch(() => pb.collection('list_items').update<ListItemRecord>(itemId, item), toError);

export const deleteListItem = (pb: Client) => (itemId: string) =>
	TE.tryCatch(() => pb.collection('list_items').delete(itemId), toError)

///////////////// Curried functions /////////////////////

export const getListCurried = (pb: Client) => (listId: string) => getList(pb, listId);

export const getListItemsCurried = (pb: Client) => (listId: string) => getListItems(pb, listId);

export const getListWithItemsCurried = (pb: Client) => (listId: string) =>
	getListWithItems(pb, listId);

export const addItemToListCurried = (pb: Client) => (listId: string) => (item: ListItem) =>
	addItemToList(pb, listId, item);
