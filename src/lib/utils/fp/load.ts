import type { Either } from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import type { TaskEither } from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/lib/function';
import { throwLeftUnwrap } from './throwLeftUnwrap';

interface ToTaskThrowLeft {
	/**
	 * Convert a TaskEither to a Task by throwing Left if the inner Either is a Left value.
	 */
	<E, A>(): (fa: TaskEither<E, A>) => T.Task<A>;
	/**
	 * Convert a TaskEither to a Task by throwing the left value if the inner Either
	 * is a left value or mapping the right value with @param mapFn.
	 *
	 * @param mapFn Transforms the contained value
	 * @returns A Task of the value transformed by @param mapFn
	 */
	<E, A, B>(mapFn: (a: A) => B): (fa: TaskEither<E, A>) => T.Task<B>;
}

export const toTaskThrowLeft: ToTaskThrowLeft = (mapFn?: (a: unknown) => unknown) =>
	mapFn
		? flow(
				T.map<Either<unknown, unknown>, unknown>(throwLeftUnwrap),
				T.map<unknown, unknown>(mapFn)
		  )
		: T.map(throwLeftUnwrap);
