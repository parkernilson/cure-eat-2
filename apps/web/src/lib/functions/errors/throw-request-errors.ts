import { error } from "@sveltejs/kit"
import { ClientResponseError } from "pocketbase"

/**
 * Handle errors during SvelteKit requests by throwing SvelteKit errors.
 * This will help SvelteKit know how to render the error in a user friendly way
 */
export const throwRequestErrors = (e: unknown) => {
	// handle specific errors here
	if (e instanceof ClientResponseError) {
		throw error(e.status, e.message)
	} else {
		console.error('Encountered an unknown error:')
		console.error(e)
		throw e
	}
}