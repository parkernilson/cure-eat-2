import { toError } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither'

export const responseToJson = <T>(response: Response) =>
	TE.tryCatch(() => response.json() as Promise<T>, toError);