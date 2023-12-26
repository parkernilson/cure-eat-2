<script lang="ts">
    import type { ProductModel } from "$lib/interfaces/products/kroger/product-search-api";
    import { USDollar } from "$lib/functions/utils/currency";
	import type { SubmitFunction } from "../../../routes/(logged-in)/lists/[listId]/$types";
	import { enhance } from "$app/forms";
	import type { ListItemRecord, ListRecord } from "$lib/interfaces/lists";
	import { getDefaultImageSize } from "$lib/functions/utils/kroger/images";

    export let product: ProductModel;
    export let list: ListRecord;
    export let item: ListItemRecord;

    $: defaultImage = getDefaultImageSize(product.images);
    $: defaultImageUrl = defaultImage._tag === "Some" ? defaultImage.value.url : null;

    let setProductForm: HTMLFormElement;

	const selectProductHandler: SubmitFunction = () => {
		return async ({ update }) => {
            await update({ reset: false, invalidateAll: true })
		}
	}

    const setProduct = () => {
        setProductForm.requestSubmit();
    }

    let priceString = product.items[0].price?.regular ? USDollar.format(product.items[0].price?.regular) : null

</script>

<button on:click={setProduct} class="flex items-center">
    <img class="w-16" alt="product option" src={defaultImageUrl} />
    <div class="flex-1 flex flex-col">
        <p>{product.description}</p>
        <p>{priceString ?? 'No price available'}</p>
    </div>
    <form bind:this={setProductForm} hidden use:enhance={selectProductHandler} method="post" action="?/setProduct" class="flex">
        <input hidden name="name" value={product.description} />
        <input hidden name="price" value={priceString} />
        <input hidden name="location_id" value={list.location_id} />
        <input hidden name="external_id" value={product.productId} />
        <input hidden name="thumbnail_url" value={defaultImageUrl} />
        <input hidden name="list" value={list.id} />
        <input hidden name="item_id" value={item.id} />
    </form>
</button>