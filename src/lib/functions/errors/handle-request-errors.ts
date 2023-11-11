import { error } from "@sveltejs/kit"
import { ClientResponseError } from "pocketbase"

/**
 * Handle errors during SvelteKit requests by throwing SvelteKit errors.
 * This will help SvelteKit know how to render the error in a user friendly way
 */
export const handleRequestErrors = (e: unknown) => {
	// handle specific errors here
	if (e instanceof ClientResponseError) {
		throw error(e.status, e.message)
	} else {
		throw e
	}
}