import { getAdminClient } from '$lib/functions/auth/pocketbase';
import { throwRequestErrors } from '$lib/functions/errors/throw-request-errors.js';
import { createListItemObject } from '$lib/functions/lists';
import { addItemToListCurried, deleteListItem, getListWithItemsCurried } from '$lib/functions/lists/db-accessors';
import { searchKrogerProduct } from '$lib/functions/products/kroger/search-product.js';
import { getFormData, getStringWithKey } from '$lib/functions/utils/fp/form-data';
import { sequenceT } from 'fp-ts/lib/Apply';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';

export const load = ({ locals, params }) =>
	pipe(
		params.listId,
		getListWithItemsCurried(locals.pb),
		TE.map((list) => ({ list })),
		TE.getOrElse(throwRequestErrors)
	)();

export const actions = {
	addItem: async ({ locals, params, request }) =>
		pipe(
			getFormData(request),
			TE.flatMap(formData => pipe(
				TE.fromEither(getStringWithKey(formData)('value')),
				TE.map(createListItemObject(params.listId)),
				TE.flatMap(addItemToListCurried(locals.pb)(params.listId)),
			)),
			TE.getOrElse(throwRequestErrors)
		)(),
	deleteItem: async ({ locals, request }) =>
		pipe(
			getFormData(request),
			TE.flatMap(formData => pipe(
				TE.fromEither(getStringWithKey(formData)('itemId')),
				TE.flatMap(deleteListItem(locals.pb))
			)),
			TE.getOrElse(throwRequestErrors)
		)(),
	searchProduct: async ({ request }) =>
		pipe(
			sequenceT(TE.ApplicativePar)(getAdminClient(), getFormData(request)),
			TE.flatMap(([adminClient, formData]) => pipe(
				TE.fromEither(getStringWithKey(formData)('searchTerm')),
				TE.flatMap(searchKrogerProduct(adminClient)),
			)),
			TE.getOrElse(throwRequestErrors)
		)()
};
