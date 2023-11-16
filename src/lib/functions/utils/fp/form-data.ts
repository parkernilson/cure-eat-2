import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';

export const getStringWithKey = (formData: FormData) => (key: string) =>
	pipe(
		formData.get(key),
		E.fromNullable(new Error(`Key ${key} was not found in form data`)),
		E.flatMap(
			E.fromPredicate(
				(value): value is string => typeof value === 'string',
				() => new Error(`Key ${key} was not a string`)
			)
		)
	);

export const getFormData = (request: Request) => TE.tryCatch(() => request.formData(), E.toError);
