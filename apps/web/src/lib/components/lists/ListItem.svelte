<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { doNothing, performIO } from '$lib/functions/utils/fp/io';
	import type { ListItemRecord } from '$lib/interfaces/lists';
	import type { SubmitFunction } from '../../../../.svelte-kit/types/src/routes/(logged-in)/lists/[listId]/$types';
	import { sequenceT } from 'fp-ts/lib/Apply';
	import * as IO from 'fp-ts/lib/IO';
	import * as B from 'fp-ts/lib/boolean';
	import { pipe } from 'fp-ts/lib/function';
	import { debounce } from 'lodash-es';

	export let item: ListItemRecord;

	let value: string = item.value;
	export let valueInput: HTMLInputElement;

    export let addItemSubmit: SubmitFunction

	let deleteItemForm: HTMLFormElement;
	let addItemForm: HTMLFormElement;
	let updateItemForm: HTMLFormElement;

	const debouncedUpdate = debounce(() => updateItemForm?.requestSubmit(), 1000);

	const handleKeyDown = async (e: KeyboardEvent) => {
		if (e.key === 'Enter' && value.trim().length > 0) {
			updateItemForm.requestSubmit()
			addItemForm.requestSubmit()
		} else if (e.key === 'Backspace' && value === '') {
			deleteItemForm.requestSubmit()
		} else if (value.trim().length > 0) {
			debouncedUpdate()
		}
	}
</script>

<div class="flex items-center">
	<i class="{item.checked ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'} mr-3" />
	<input bind:this={valueInput} class="flex-1 m-3" bind:value on:keydown={handleKeyDown} />
	<p class="mr-3">|</p>
	<form method="post" action="?/searchProduct" use:enhance>
		<input class="hidden" name="searchTerm" type="text" value={item.value} />
		<button type="submit">Search</button>
	</form>
</div>

<form use:enhance={addItemSubmit} bind:this={addItemForm} class="hidden" method="post" action="?/addItem">
	<input name="value" type="hidden" value={''} />
	<input name="ordinal" type="hidden" value={item.ordinal + 1} />
</form>

<form use:enhance={() => () => {}} bind:this={updateItemForm} class="hidden" method="post" action="?/updateItem">
	<input name="value" {value} type="hidden" />
	<input name="itemId" value={item.id} type="hidden" />
</form>

<form use:enhance bind:this={deleteItemForm} class="hidden" method="post" action="?/deleteItem">
	<input name="itemId" type="hidden" value={item.id} />
</form>
