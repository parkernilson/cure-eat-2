import type { IO } from 'fp-ts/lib/IO'

export const doNothing = (): IO<void> => () => {}

/**
 * This bizarre little function is essentially just an identity function for IO.
 * It helps with syntax to avoid having to write () => () => <action> which can be confusing.
 * 
 * i.e.
 * ```
 * B.fold(
 *   () => doIO(),
 *   () => () => (a = 1)
 * )
 * ```
 * becomes:
 * ```
 * B.fold(
 *  () => doIO(),
 *  () => performIO(() => (a = 1))
 * )
 * ```
 * In which case it is much clearer that the anonymous function is returning an IO.
 */
export const performIO = <T>(io: IO<T>) => io