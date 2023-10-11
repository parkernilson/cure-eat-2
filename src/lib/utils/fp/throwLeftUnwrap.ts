import type { Either } from 'fp-ts/Either';
import * as E from 'fp-ts/Either';

/**
 * Expose the contained value of an either by throwing if it's left and returning the contained value if it's right
 * @param e the either to unwrap
 * @throws the left value
 * @returns the right value of an either
 */
export const throwLeftUnwrap = <E, A>(e: Either<E, A>) => {
	if (E.isLeft(e)) {
		throw e.left;
	} else {
		return e.right;
	}
};
