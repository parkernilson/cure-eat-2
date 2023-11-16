import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { sequenceS, sequenceT } from 'fp-ts/lib/Apply';
import { pipe } from 'fp-ts/lib/function';
import { createList, getAllListsWithItems } from '$lib/functions/lists/db-accessors.js';
import { throwRequestErrors } from '$lib/functions/errors/throw-request-errors.js';
import { getFormData, getStringWithKey } from '$lib/functions/utils/fp';
import { isSupportedColor } from '$lib/interfaces/lists/db-model.js';

export const load = ({ locals }) =>
	pipe(
		getAllListsWithItems(locals.pb),
		TE.map((lists) => ({ lists, user: locals.pb.authStore.model })),
		TE.getOrElse(throwRequestErrors)
	)();

const getListFromFormData = (formData: FormData) =>
	pipe(
		sequenceS(E.Applicative)({
			title: pipe(
				getStringWithKey(formData)('title'),
				E.flatMap(
					E.fromPredicate(
						(title) => title.length > 2,
						() => new Error('Title must be at least 3 characters')
					)
				)
			),
			color: pipe(
				getStringWithKey(formData)('color'),
				E.flatMap(
					E.fromPredicate(
						isSupportedColor,
						(wrongColor) => new Error(`Invalid color: ${wrongColor}`)
					)
				)
			)
		})
	);

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
					TE.flatMap(createList(locals.pb)(userModel.id))
				)
			),
			TE.getOrElse(throwRequestErrors)
		)()
};
