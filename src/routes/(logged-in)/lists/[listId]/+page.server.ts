import { throwRequestErrors } from '$lib/functions/errors/throw-request-errors.js';
import { createListItemObject } from '$lib/functions/lists';
import { addItemToListCurried, getListWithItemsCurried } from '$lib/functions/lists/db-accessors';
import { getFormData, getStringWithKey } from '$lib/functions/utils/fp/form-data';
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
			TE.flatMapEither(getStringWithKey('value')),
			TE.map(createListItemObject(params.listId)),
			TE.flatMap(addItemToListCurried(locals.pb)(params.listId)),
			TE.getOrElse(throwRequestErrors)
		)()
};
