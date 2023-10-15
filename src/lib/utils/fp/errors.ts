import { error } from '@sveltejs/kit'
import * as E from 'fp-ts/lib/Either'
import type { Either } from 'fp-ts/lib/Either'
import { ClientResponseError } from 'pocketbase'

/**
 * Unwrap the right side of an Either, or throw an error if the Either is a Left.
 * This function will throw sveltekit errors based on the app-specific type of the error
 * 
 * NOTE: This function is intended to be used in the context of processing SvelteKit requests.
 * Therefore, errors are intentionally thrown so that SvelteKit can handle them with the corresponding
 * error page.
 * @param e 
 * @returns 
 */
export const handleAndThrowErrors = <E, A>(e: Either<E, A>) => {
	if (E.isLeft(e)) {
		// handle specific errors here
		if (e.left instanceof ClientResponseError) {
			throw error(e.left.status, e.left.message)
		} else {
			throw e.left
		}
	} else {
		return e.right
	}
}