import type {
	List,
	ListExpanded,
	ListItem,
	ListItemRecord,
	ListRecord,
	ListWithItemsRecord
} from '$lib/interfaces/lists';
import type { Product } from '$lib/interfaces/products';
import { toError } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as B from 'fp-ts/lib/boolean';
import { pipe } from 'fp-ts/lib/function';
import type Client from 'pocketbase';
import { createProduct, deleteProduct } from '../products';
import { sequenceT } from 'fp-ts/lib/Apply';

export const getList = (pb: Client, listId: string) =>
	TE.tryCatch(() => pb.collection('lists').getOne<ListRecord>(listId), toError);

export const getListItems = (pb: Client, listId: string) =>
	TE.tryCatch(
		() => pb.collection('list_items').getFullList<ListItemRecord>({ filter: `list = '${listId}'` }),
		toError
	);

export const getListItem = (pb: Client) => (itemId: string) =>
	TE.tryCatch(() => pb.collection('list_items').getOne<ListItemRecord>(itemId), toError);

const unpackExpandedList = ({
	expand: expandList,
	...list
}: ListExpanded): ListWithItemsRecord => ({
	...list,
	items:
		expandList && expandList['list_items(list)']
			? expandList['list_items(list)'].map(({ expand: expandListItem, ...item }) => ({
					...item,
					product: expandListItem?.product ?? undefined
			  }))
			: []
});

export const getListWithItems = (pb: Client, listId: string) =>
	pipe(
		TE.tryCatch(
			() =>
				pb.collection('lists').getOne<ListExpanded>(listId, { expand: 'list_items(list).product' }),
			toError
		),
		TE.map(unpackExpandedList)
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
					expand: 'list_items(list).product'
				}),
			toError
		),
		TE.map((lists) => lists.map(unpackExpandedList))
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
	TE.tryCatch(() => pb.collection('list_items').delete(itemId), toError);

const updateListItemProduct = (pb: Client) => (itemId: string) => (productId: string) =>
	TE.tryCatch(() => pb.collection('list_items').update<ListItemRecord>(itemId, { product: productId }), toError);

export const setProduct = (pb: Client) => (itemId: string) => (product: Product) =>
	pipe(
		sequenceT(TE.ApplicativePar)(createProduct(pb)(product), getListItem(pb)(itemId)),
		TE.flatMap(([productModel, listItem]) =>
			pipe(
				updateListItemProduct(pb)(listItem.id)(productModel.id),
				TE.flatMap(() => B.fold(
					() => TE.of(false),
					() => deleteProduct(pb)(listItem.product!)
				)(!!listItem.product))
			)
		)
	);

///////////////// Curried functions /////////////////////

export const getListCurried = (pb: Client) => (listId: string) => getList(pb, listId);

export const getListItemsCurried = (pb: Client) => (listId: string) => getListItems(pb, listId);

export const getListWithItemsCurried = (pb: Client) => (listId: string) =>
	getListWithItems(pb, listId);

export const addItemToListCurried = (pb: Client) => (listId: string) => (item: ListItem) =>
	addItemToList(pb, listId, item);
