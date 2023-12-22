import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { sequenceS, sequenceT } from 'fp-ts/lib/Apply';
import { pipe } from 'fp-ts/lib/function';
import { createList, deleteList, getAllLists } from '$lib/functions/lists/db-accessors.js';
import { throwRequestErrors } from '$lib/functions/errors/throw-request-errors.js';
import { getFormData, getStringWithKey } from '$lib/functions/utils/fp';
import { isListRaw, isSupportedColor, type ListRaw } from '$lib/interfaces/lists';

export const load = ({ locals }) =>
	pipe(
		getAllLists(locals.pb),
		TE.map((lists) => ({ lists, user: locals.pb.authStore.model })),
		TE.getOrElse(throwRequestErrors)
	)();

const getListFromFormData = (owner: string) => (formData: FormData): TE.TaskEither<Error, ListRaw> =>
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
			),
			owner: E.right(owner),
			location_id: pipe(
				getStringWithKey(formData)('location_id'),
				E.altW(() => E.right(undefined))
			),
			location_name: pipe(
				getStringWithKey(formData)('location_name'),
				E.altW(() => E.right(undefined))
			)
		}),
		TE.fromEither,
		TE.flatMap(TE.fromPredicate(isListRaw, () => new Error('Invalid list data')))
	)

export const actions = {
	createList: ({ request, locals }) =>
		pipe(
			sequenceT(TE.ApplicativePar)(
				getFormData(request),
				TE.fromNullable(new Error('Auth store was null'))(locals.pb.authStore.model)
			),
			TE.flatMap(([formData, userModel]) =>
				pipe(
					getListFromFormData(userModel.id)(formData),
					TE.flatMap(createList(locals.pb))
				)
			),
			TE.getOrElse(throwRequestErrors)
		)(),
	deleteList: ({ request, locals }) =>
		pipe(
			getFormData(request),
			TE.flatMapEither(formData => getStringWithKey(formData)('listId')),
			TE.flatMap(deleteList(locals.pb)),
			TE.getOrElse(throwRequestErrors)
		)()
};
