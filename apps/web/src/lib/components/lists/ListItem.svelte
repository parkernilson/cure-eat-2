<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ListItemRecord } from '$lib/interfaces/lists';
	import { debounce } from 'lodash-es';
	import { tick } from 'svelte';

	export let item: ListItemRecord;
	export let index: number;
	export let focusItemAt: (index: number) => void;

	let value: string = item.value;
	export let valueInput: HTMLInputElement;

	let deleteItemForm: HTMLFormElement;
	let addItemForm: HTMLFormElement;
	let updateItemForm: HTMLFormElement;

	const debouncedUpdate = debounce(() => updateItemForm?.requestSubmit(), 1000);

	const handleKeyDown = async (e: KeyboardEvent) => {
		if (e.key === 'Enter' && value.trim().length > 0) {
			updateItemForm.requestSubmit();
			addItemForm.requestSubmit();
		} else if (e.key === 'Backspace' && value === '') {
			console.log('requesting delete with itemId: ', item.id)
			deleteItemForm.requestSubmit();
		} else if (value.trim().length > 0) {
			debouncedUpdate();
		}
	};
</script>

<div class="flex items-center">
	<i class="{item.checked ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'} mr-3" />
	<input bind:this={valueInput} class="flex-1 m-3" bind:value on:keydown={handleKeyDown} />
	<p class="mr-3">|</p>
	<form method="post" action="?/searchProduct" use:enhance={() => () => {}}>
		<input class="hidden" name="searchTerm" type="text" value={item.value} />
		<button type="submit">Search</button>
	</form>
</div>

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
	use:enhance={() => () => {}}
	bind:this={updateItemForm}
	class="hidden"
	method="post"
	action="?/updateItem"
>
	<input name="value" {value} type="hidden" />
	<input name="itemId" value={item.id} type="hidden" />
</form>

<form use:enhance={() => {
	return async ({ result, update }) => {
		await update({ reset: false, invalidateAll: true });
		await tick();
		if (result.type === 'success') {
			focusItemAt(index - 1);
		}
	};
}} bind:this={deleteItemForm} class="hidden" method="post" action="?/deleteItem">
	<input name="itemId" type="hidden" value={item.id} />
</form>
