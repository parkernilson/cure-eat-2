import { toError } from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import * as B from 'fp-ts/lib/boolean'
import { pipe } from 'fp-ts/lib/function'
// import { traceWithValue } from 'fp-ts-std/Debug'
import Client, { ClientResponseError, type RecordModel } from 'pocketbase'

/**
 * Update or create a document in the specified collection.
 * If the document exists, it will be updated. Otherwise it will be created.
 * @param client Pocketbase Client
 * @param collection 
 * @param id 
 * @param data 
 * @returns A record of the updated or created document
 */
export const updateOrCreate = <T extends { [key: string]: unknown }>(client: Client, collection: string, id: string, data: T) => pipe(
	TE.tryCatch(
		() => client.collection(collection).update<T & RecordModel>(id, data),
		toError
	),
	TE.orElse(e => pipe(
		e instanceof ClientResponseError && e.status === 404,
		B.fold(
			() => TE.left(e),
			() => TE.tryCatch(
				() => client.collection(collection).create<T & RecordModel>(data),
				toError
			)
		),
	))
)
