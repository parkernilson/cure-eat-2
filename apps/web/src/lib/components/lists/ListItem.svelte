<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { ListItemRecord, ListRecord } from '$lib/interfaces/lists';
	import type { ProductModel } from '$lib/interfaces/products/kroger/product-search-api';
	import { debounce } from 'lodash-es';
	import { tick } from 'svelte';
	import type { SubmitFunction } from '../../../routes/(logged-in)/lists/[listId]/$types';
	import ProductOption from '../products/ProductOption.svelte';

	export let list: ListRecord;
	export let item: ListItemRecord;
	export let index: number;
	export let focusItemAt: (index: number) => void;

	let value: string = item.value;
	export let valueInput: HTMLInputElement;

	let productOptions: ProductModel[];
	let showProductOptionsModal: boolean = false;
	let editingValue: boolean = false;

	let thumbnailUrl = item.product?.thumbnail_url ?? 'default url'; // TODO: add a default thumbnail for products

	let deleteItemForm: HTMLFormElement;
	let addItemForm: HTMLFormElement;
	let updateItemForm: HTMLFormElement;

	const searchProductHandler: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				if (result.data?.formId === 'searchProduct') {
					productOptions = result.data.product.data;
					showProductOptionsModal = true;
				}
			}
		};
	};

	const debouncedUpdate = debounce(() => updateItemForm?.requestSubmit(), 1000);

	const handleKeyDown = async (e: KeyboardEvent) => {
		if (e.key === 'Enter' && value.trim().length > 0) {
			updateItemForm.requestSubmit();
			addItemForm.requestSubmit();
		} else if (e.key === 'Backspace' && value === '') {
			deleteItemForm.requestSubmit();
		} else if (value.trim().length > 0) {
			debouncedUpdate();
		}
	};

</script>

<div class="flex items-center">
	<i class="{item.checked ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'} mr-3" />
	<!-- svelte-ignore a11y-autofocus -->
	<input 
		bind:this={valueInput} 
		class="flex-1 m-3" 
		bind:value 
		on:keydown={handleKeyDown} 
		on:focusin={() => editingValue = true}
		on:focusout={() => editingValue = false}
		autofocus={editingValue}
	/>
	<p class="mr-3">|</p>
	<form method="post" action="?/searchProduct" use:enhance={searchProductHandler}>
		<input
			class="hidden"
			name="searchTerm"
			type="text"
			value={item.search_term?.length && item.search_term.length > 0
				? item.search_term
				: item.value}
		/>
		<input class="hidden" name="locationId" type="text" value={list.location_id} />
		{#if item.product}
			<button type="submit" class="w-10 h-10 bg-contain bg-center bg-no-repeat" style="
				background-image: url({item.product.thumbnail_url});
			"></button>
		{:else}
			<button type="submit">Search</button>
		{/if}
	</form>
</div>

<Modal bind:showModal={showProductOptionsModal}>
	<form method="post" use:enhance action="?/removeProduct">
		<input hidden name="itemId" value={item.id} />
		<button type="submit">Remove product</button>
	</form>	
	<h1>Product Options</h1>
	<form method="post" use:enhance={searchProductHandler} action="?/searchProduct">
		<input type="text" name="searchTerm" placeholder="Search term" />
		<input class="hidden" name="locationId" type="text" value={list.location_id} />
		<button>Search</button>
	</form>
	{#if productOptions?.length > 0}
		{#each productOptions as product}
			<ProductOption {product} {list} {item} />
		{/each}
	{/if}
</Modal>

<form
	use:enhance={() => {
		return async ({ result, update }) => {
			await update({ reset: false, invalidateAll: true });
			await tick();
			if (result.type === 'success') {
				focusItemAt(index + 1);
			}
		};
	}}
	bind:this={addItemForm}
	class="hidden"
	method="post"
	action="?/addItem"
>
	<input name="newValue" type="hidden" value={''} />
	<input name="ordinal" type="hidden" value={item.ordinal + 1} />
</form>

<form
	use:enhance
	bind:this={updateItemForm}
	class="hidden"
	method="post"
	action="?/updateItem"
>
	<input name="value" {value} type="hidden" />
	<input name="itemId" value={item.id} type="hidden" />
</form>

<form
	use:enhance={() => {
		return async ({ result, update }) => {
			await update({ reset: false, invalidateAll: true });
			await tick();
			if (result.type === 'success') {
				focusItemAt(index - 1);
			}
		};
	}}
	bind:this={deleteItemForm}
	class="hidden"
	method="post"
	action="?/deleteItem"
>
	<input name="itemId" type="hidden" value={item.id} />
</form>
