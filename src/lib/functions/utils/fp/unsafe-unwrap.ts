import type { Either } from "fp-ts/lib/Either";

export const unsafeUnwrap = <E, A>(ma: Either<E, A>) => {
    if (ma._tag === 'Right') {
        return ma.right;
    }
    throw ma.left;
}