// import { getListWithItems } from '$lib/lists/lists';
import { createListItem } from '$lib/functions/lists';
import { addItemToListCurried, getListWithItemsCurried } from '$lib/functions/lists/db';
import { handleAndThrowErrors } from '$lib/functions/helpers/fp';
import { getFormData, getStringWithKey } from '$lib/functions/helpers/fp/formData';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';

export const load = ({ locals, params }) =>
	pipe(
		params.listId,
		getListWithItemsCurried(locals.pb),
		TE.map((list) => ({ list })),
		T.map(handleAndThrowErrors)
	)();

export const actions = {
	addItem: async ({ locals, params, request }) =>
		pipe(
			getFormData(request),
			TE.flatMapEither(getStringWithKey('value')),
			TE.map(createListItem(params.listId)),
			TE.flatMap(addItemToListCurried(locals.pb)(params.listId)),
			T.map(handleAndThrowErrors)
		)()
};
