import * as TE from 'fp-ts/lib/TaskEither'
import { toError } from 'fp-ts/lib/Either'
import type Client from 'pocketbase'

export const registerUsernamePassword = (adminClient: Client, username: string, password: string) =>
	TE.tryCatch(() => adminClient.collection('users').create({ username, password, passwordConfirm: password }), toError)