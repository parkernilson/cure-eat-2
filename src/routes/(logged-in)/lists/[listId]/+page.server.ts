// import { getListWithItems } from '$lib/lists/lists';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { handleAndThrowErrors } from '$lib/utils/fp';
import { addItemToListCurried, getListWithItemsCurried } from '$lib/lists/db';
import { toError } from 'fp-ts/lib/Either';
import { getStringWithKey } from '$lib/utils/fp/formData';
import { createListItem } from '$lib/lists';

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
			TE.tryCatch(() => request.formData(), toError),
			TE.flatMapEither(getStringWithKey('value')),
			TE.map(createListItem(params.listId)),
			TE.flatMap(addItemToListCurried(locals.pb)(params.listId)),
			T.map(handleAndThrowErrors)
		)()
};
