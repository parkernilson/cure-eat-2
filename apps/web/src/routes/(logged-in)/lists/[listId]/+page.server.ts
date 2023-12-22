import { getAdminClient } from '$lib/functions/auth/pocketbase';
import { throwRequestErrors } from '$lib/functions/errors/throw-request-errors.js';
import { createDefaultListItemObject } from '$lib/functions/lists';
import {
	addItemToList,
	deleteListItem,
	getList,
	removeProduct,
	setProduct,
	updateItem
} from '$lib/functions/lists/db-accessors';
import { searchKrogerProduct } from '$lib/functions/products/kroger/search-product.js';
import { getFormData, getStringWithKey } from '$lib/functions/utils/fp/form-data';
import { sequenceS, sequenceT } from 'fp-ts/lib/Apply';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { queryLocations } from '$lib/functions/store-locations/kroger/query-locations.js';
import { setLocation } from '$lib/functions/store-locations/db-accessors';

export const load = ({ locals, params }) =>
	pipe(
		getList(locals.pb)(params.listId),
		TE.map((list) => ({ list })),
		TE.getOrElse(throwRequestErrors)
	)();

export const actions = {
	updateItem: async ({ locals, request }) =>
		pipe(
			getFormData(request),
			TE.flatMapEither((formData) =>
				sequenceS(E.Applicative)({
					value: getStringWithKey(formData)('value'),
					itemId: getStringWithKey(formData)('itemId')
				})
			),
			TE.flatMap(({ itemId, ...listItem }) => updateItem(locals.pb)(itemId)(listItem)),
			TE.getOrElse(throwRequestErrors),
			T.map((listItemRecord) => ({ listItemRecord, formId: 'updateItem' as const }))
		)(),
	addItem: async ({ locals, params, request }) =>
		pipe(
			getFormData(request),
			TE.flatMapEither((formData) =>
				sequenceS(E.Applicative)({
					value: getStringWithKey(formData)('newValue'),
					ordinal: pipe(getStringWithKey(formData)('ordinal'), E.map(Number))
				}),
			),
			TE.map(createDefaultListItemObject(params.listId)),
			TE.flatMap(addItemToList(locals.pb)(params.listId)),
			TE.getOrElse(throwRequestErrors),
			T.map((listItemRecord) => ({ listItemRecord, formId: 'addItem' as const }))
		)(),
	deleteItem: async ({ locals, request }) =>
		pipe(
			getFormData(request),
			TE.flatMapEither((formData) => getStringWithKey(formData)('itemId')),
			TE.flatMap(deleteListItem(locals.pb)),
			TE.getOrElse(throwRequestErrors),
			T.map((success) => ({ success, formId: 'deleteItem' as const }))
		)(),
	searchProduct: async ({ request }) =>
		pipe(
			sequenceT(TE.ApplicativePar)(getAdminClient(), getFormData(request)),
			TE.flatMap(([adminClient, formData]) =>
				pipe(
					sequenceS(E.Applicative)({
						locationId: getStringWithKey(formData)('locationId'),
						searchTerm: getStringWithKey(formData)('searchTerm')
					}),
					TE.fromEither,
					TE.flatMap(searchKrogerProduct(adminClient))
				)
			),
			TE.getOrElse(throwRequestErrors),
			T.map((product) => ({ product, formId: 'searchProduct' as const }))
		)(),
	setProduct: async ({ request, locals }) =>
		pipe(
			getFormData(request),
			TE.flatMapEither((formData) =>
				sequenceS(E.Applicative)({
					name: getStringWithKey(formData)('name'),
					price: getStringWithKey(formData)('price'),
					location_id: getStringWithKey(formData)('location_id'),
					external_id: getStringWithKey(formData)('external_id'),
					list: getStringWithKey(formData)('list'),
					thumbnail_url: getStringWithKey(formData)('thumbnail_url'),
					item_id: getStringWithKey(formData)('item_id')
				})
			),
			TE.flatMap(({item_id, ...product}) => setProduct(locals.pb)(item_id)(product)),
			TE.getOrElse(throwRequestErrors),
			T.map((productModel) => ({ product: productModel, formId: 'setProduct' as const }))
		)(),
	removeProduct: async ({ request, locals }) =>
		pipe(
			getFormData(request),
			TE.flatMapEither(formData => getStringWithKey(formData)('itemId')),
			TE.flatMap(removeProduct(locals.pb)),
			TE.getOrElse(throwRequestErrors),
			T.map((success) => ({ success, formId: 'removeProduct' as const }))
		)(),
	setSearchTerm: async ({ request, locals }) =>
		pipe(
			getFormData(request),
			TE.flatMapEither((formData) =>
				sequenceS(E.Applicative)({
					searchTerm: getStringWithKey(formData)('searchTerm'),
					itemId: getStringWithKey(formData)('itemId')
				})
			),
			TE.flatMap(({ searchTerm, itemId }) =>
				updateItem(locals.pb)(itemId)({ search_term: searchTerm })
			),
			TE.getOrElse(throwRequestErrors),
			T.map((listItem) => ({ listItem, formId: 'setSearchTerm' as const }))
		)(),
	queryLocations: async ({ request }) =>
		pipe(
			sequenceT(TE.ApplicativePar)(getAdminClient(), getFormData(request)),
			TE.flatMap(([adminClient, formData]) =>
				pipe(
					TE.fromEither(getStringWithKey(formData)('zipCode')),
					TE.map((zipCode) => ({ zipCode })),
					TE.flatMap(queryLocations(adminClient))
				)
			),
			TE.getOrElse(throwRequestErrors),
			T.map((krogerLocationResponse) => ({
				locationOptions: krogerLocationResponse.data,
				formId: 'queryLocations' as const
			}))
		)(),
	setLocation: async ({ request, locals, params }) =>
		pipe(
			getFormData(request),
			TE.flatMap((formData) =>
				sequenceS(TE.ApplicativePar)({
					locationId: TE.fromEither(getStringWithKey(formData)('locationId')),
					locationName: TE.fromEither(getStringWithKey(formData)('locationName'))
				})
			),
			TE.flatMap(setLocation(locals.pb)(params.listId)),
			TE.getOrElse(throwRequestErrors),
			T.map((updatedListRecord) => ({ updatedListRecord, formId: 'setLocation' as const }))
		)(),
};
