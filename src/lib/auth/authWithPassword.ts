import * as TE from 'fp-ts/lib/TaskEither'
import { toError } from 'fp-ts/lib/Either'
import type Client from 'pocketbase'

export const authWithPassword = (pb: Client, username: string, password: string) =>
	TE.tryCatch(() => pb.collection('users').authWithPassword(username, password), toError)