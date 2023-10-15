import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'

export const getString = (formData: FormData, key: string) =>
	E.fromNullable(new Error(`Form data was not a string`))(
		typeof formData.get(key) === 'string' ? (formData.get(key) as string) : null
	);

export const getStringWithKey = (key: string) => (formData: FormData) => getString(formData, key);

export const getFormData = (request: Request) => TE.tryCatch(() => request.formData(), E.toError);