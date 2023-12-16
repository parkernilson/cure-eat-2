import type { KrogerProductImage } from "$lib/interfaces/products/kroger/product-search-api";
import { pipe } from "fp-ts/lib/function";
import * as O from 'fp-ts/lib/Option';

const getDefaultImage = (images: KrogerProductImage[]) =>
    pipe(
        O.fromNullable(images.find(i => i.featured)),
        O.alt(() => O.fromNullable(images[0]))
    )

const getDefaultSize = (image: KrogerProductImage) =>
    pipe(
        O.fromNullable(image.sizes.find(s => s.size === 'medium')),
        O.alt(() => O.fromNullable(image.sizes[0]))
    )

export const getDefaultImageSize = (images: KrogerProductImage[]) => 
    pipe(
        images,
        getDefaultImage,
        O.flatMap(getDefaultSize)
    )