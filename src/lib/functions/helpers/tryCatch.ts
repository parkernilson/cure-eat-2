/** The result of a try catch is either a result and no error, or a null result and an unknown type of error */
type TryCatchResult<T> = [result: T, error: null] | [result: null, error: unknown];

/**
 * Performs an asynchronous action within a try / catch block and returns the result as a concise tuple
 * @param action
 */
export async function tryCatch<T>(action: Promise<T>): Promise<TryCatchResult<T>> {
	try {
		const result = await action;
		return [result, null];
	} catch (error) {
		return [null, error];
	}
}
