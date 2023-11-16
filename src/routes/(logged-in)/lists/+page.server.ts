import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { sequenceS, sequenceT } from 'fp-ts/lib/Apply';
import { pipe } from 'fp-ts/lib/function';
import { createList, getAllLists } from '$lib/functions/lists/db-accessors.js';
import { throwRequestErrors } from '$lib/functions/errors/throw-request-errors.js';
import { getFormData, getStringWithKey } from '$lib/functions/utils/fp';

export const load = ({ locals }) =>
	pipe(
		getAllLists(locals.pb),
		TE.map((lists) => ({ lists, user: locals.pb.authStore.model })),
		TE.getOrElse(throwRequestErrors)
	)();

const getListFromFormData = (formData: FormData) =>
	sequenceS(E.Applicative)({
		title: getStringWithKey(formData)('title')
	})

export const actions = {
	createList: ({ request, locals }) =>
		pipe(
			sequenceT(TE.ApplicativePar)(
				getFormData(request),
				TE.fromNullable(new Error('Auth store was null'))(locals.pb.authStore.model)
			),
			TE.flatMap(([formData, userModel]) =>
				pipe(
					TE.fromEither(getListFromFormData(formData)),
					TE.flatMap(createList(locals.pb)(userModel.id)),
				)
			),
            TE.getOrElse(throwRequestErrors)
		)()
};
