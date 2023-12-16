import type { Product, ProductRecord } from '$lib/interfaces/products';
import type Client from 'pocketbase';
import * as TE from 'fp-ts/lib/TaskEither';
import { toError } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';

export const createProduct = (pb: Client) => (product: Product) =>
	TE.tryCatch(
		() => pb.collection('products').create<ProductRecord>(product),
		toError
	)

export const deleteProduct = (pb: Client) => (productOrId: ProductRecord | string) =>
	pipe(
		typeof productOrId === 'string' ? productOrId : productOrId.id,
		TE.tryCatchK(
			id => pb.collection('products').delete(id),
			toError
		),
	)