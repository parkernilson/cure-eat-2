import type {
	ListExpanded,
	ListItem,
	ListItemExpanded,
	ListItemRaw,
	ListItemRecord,
	ListRaw,
	ListRawRecord,
	ListRecord
} from '$lib/interfaces/lists';
import type { Product } from '$lib/interfaces/products';
import { sequenceT } from 'fp-ts/lib/Apply';
import { toError } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as B from 'fp-ts/lib/boolean';
import { pipe } from 'fp-ts/lib/function';
import type Client from 'pocketbase';
import { createProduct, deleteProduct } from '../products';

const unpackExpandedListItem = ({
	expand: expandListItem,
	...item
}: ListItemExpanded): ListItemRecord => ({
	...item,
	product: expandListItem?.product ?? undefined
});

export const getListItems = (pb: Client) => (listId: string) =>
	pipe(
		TE.tryCatch(
			() =>
				pb
					.collection('list_items')
					.getFullList<ListItemExpanded>({ filter: `list = '${listId}'`, expand: 'product' }),
			toError
		),
		TE.map((items) => items.map(unpackExpandedListItem))
	);

export const getListItem = (pb: Client) => (itemId: string) =>
	pipe(
		itemId,
		TE.fromPredicate(
			(id) => id.length > 0, 
			() => new Error("A list item id is required for this operation")
		),
		TE.flatMap(() => TE.tryCatch(
			() => pb.collection('list_items').getOne<ListItemExpanded>(itemId, { expand: 'product' }),
			toError
		)),
		TE.map(unpackExpandedListItem)
	);

const unpackExpandedList = ({ expand: expandList, ...list }: ListExpanded): ListRecord => ({
	...list,
	items:
		expandList && expandList['list_items(list)']
			? expandList['list_items(list)'].map(unpackExpandedListItem)
			: []
});

export const getList = (pb: Client) => (listId: string) =>
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
export const getAllListsWithoutItems = (pb: Client) =>
	TE.tryCatch(() => pb.collection('lists').getFullList<ListRawRecord>(), toError);

export const getAllLists = (pb: Client) =>
	pipe(
		TE.tryCatch(
			() =>
				pb.collection('lists').getFullList<ListRecord>({
					expand: 'list_items(list).product'
				}),
			toError
		),
		TE.map((lists) => lists.map(unpackExpandedList))
	);

export const createList = (pb: Client) => (list: ListRaw) =>
	TE.tryCatch(() => pb.collection('lists').create<ListRecord>(list), toError);

export const deleteList = (pb: Client) => (listId: string) =>
	TE.tryCatch(() => pb.collection('lists').delete(listId), toError);

export const addItemToList = (pb: Client) => (listId: string) => (item: ListItem) =>
	pipe(
		listId === item.list,
		B.fold(
			() => TE.left(new Error(`List id ${listId} does not match item list id ${item.list}`)),
			() => TE.tryCatch(() => pb.collection('list_items').create<ListItemRecord>(item), toError)
		)
	);

export const updateItem = (pb: Client) => (itemId: string) => (item: Partial<ListItemRaw>) =>
	TE.tryCatch(() => pb.collection('list_items').update<ListItemRecord>(itemId, item), toError);

export const deleteListItem = (pb: Client) => (itemId: string) =>
	TE.tryCatch(() => pb.collection('list_items').delete(itemId), toError);

export const setProduct = (pb: Client) => (itemId: string) => (product: Product) =>
	pipe(
		sequenceT(TE.ApplicativePar)(createProduct(pb)(product), getListItem(pb)(itemId)),
		TE.flatMap(([productModel, listItem]) =>
			pipe(
				updateItem(pb)(listItem.id)({ product: productModel.id }),
				TE.flatMap(() =>
					B.fold(
						() => TE.of(false),
						() => deleteProduct(pb)(listItem.product!)
					)(!!listItem.product)
				)
			)
		)
	);

export const removeProduct = (pb: Client) => (itemId: string) =>
	pipe(
		getListItem(pb)(itemId),
		TE.map((listItem) => listItem.product?.id),
		TE.flatMap(TE.fromNullable('no-product' as const)),
		TE.flatMap((productId) =>
			sequenceT(TE.ApplicativeSeq)(
				updateItem(pb)(itemId)({ product: "" }),
				deleteProduct(pb)(productId)
			)
		),
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		TE.map(([_, success]) => success),
		TE.orElse((e) => (e === 'no-product' ? TE.of(true) : TE.left(e)))
	);
