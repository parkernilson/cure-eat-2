import { getAdminClient } from '$lib/functions/auth/pocketbase';
import { throwRequestErrors } from '$lib/functions/errors/throw-request-errors.js';
import { createDefaultListItemObject } from '$lib/functions/lists';
import { addItemToListCurried, deleteListItem, getListWithItemsCurried, updateItem } from '$lib/functions/lists/db-accessors';
import { searchKrogerProduct } from '$lib/functions/products/kroger/search-product.js';
import { getFormData, getStringWithKey } from '$lib/functions/utils/fp/form-data';
import { sequenceS, sequenceT } from 'fp-ts/lib/Apply';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function';

export const load = ({ locals, params }) =>
	pipe(
		params.listId,
		getListWithItemsCurried(locals.pb),
		TE.map((list) => ({ list })),
		TE.getOrElse(throwRequestErrors)
	)();

export const actions = {
	updateItem: async({ locals, request }) =>
		pipe(
			getFormData(request),
			TE.flatMap(formData => pipe(
				sequenceS(E.Applicative)({
					value: getStringWithKey(formData)('value'),
					itemId: getStringWithKey(formData)('itemId'),
				}),
				TE.fromEither,
				TE.flatMap(({ itemId, ...listItem }) => updateItem(locals.pb)(itemId)(listItem)),
			)),
			TE.getOrElse(throwRequestErrors),
			T.map(listItemRecord => ({ listItemRecord, formId: 'updateItem' as const }))
		)(),
	addItem: async ({ locals, params, request }) =>
		pipe(
			getFormData(request),
			TE.flatMap(formData => pipe(
				sequenceS(E.Applicative)({
					value: getStringWithKey(formData)('value'),
					ordinal: pipe(getStringWithKey(formData)('ordinal'), E.map(Number)),
				}),
				TE.fromEither,
				TE.map(createDefaultListItemObject(params.listId)),
				TE.flatMap(addItemToListCurried(locals.pb)(params.listId)),
			)),
			TE.getOrElse(throwRequestErrors),
			T.map(listItemRecord => ({ listItemRecord, formId: 'addItem' as const }))
		)(),
	deleteItem: async ({ locals, request }) =>
		pipe(
			getFormData(request),
			TE.flatMap(formData => pipe(
				TE.fromEither(getStringWithKey(formData)('itemId')),
				TE.flatMap(deleteListItem(locals.pb))
			)),
			TE.getOrElse(throwRequestErrors),
			T.map(success => ({ success, formId: 'deleteItem' as const }))
		)(),
	searchProduct: async ({ request }) =>
		pipe(
			sequenceT(TE.ApplicativePar)(getAdminClient(), getFormData(request)),
			TE.flatMap(([adminClient, formData]) => pipe(
				TE.fromEither(getStringWithKey(formData)('searchTerm')),
				TE.flatMap(searchKrogerProduct(adminClient)),
			)),
			TE.getOrElse(throwRequestErrors),
			T.map(product => ({ product, formId: 'searchProduct' as const }))
		)()
};
