<script lang="ts">
    import { enhance } from '$app/forms';
    import * as TE from 'fp-ts/lib/TaskEither'
    import { doNothing, performIO } from '$lib/functions/utils/fp/io';
    import type { ListItemRecord } from "$lib/interfaces/lists";
    import { sequenceT } from 'fp-ts/lib/Apply';
    import * as IO from 'fp-ts/lib/IO';
    import * as B from 'fp-ts/lib/boolean';
    import { pipe } from 'fp-ts/lib/function';
    import { debounce } from 'lodash-es';
	import { onMount } from 'svelte';

    export let item: ListItemRecord

    let value: string = item.value
    let valueInput: HTMLInputElement

    let deleteItemForm: HTMLFormElement
    let addItemForm: HTMLFormElement
    let updateItemForm: HTMLFormElement

    const debouncedUpdate = debounce(() => updateItemForm.requestSubmit(), 1000)

    const handleBackspaceEvent = (e: KeyboardEvent) => pipe(
        e.key === 'Backspace' && value === '',
        B.fold(
            () => doNothing(),
            () => performIO(() => deleteItemForm.requestSubmit()),
        ),
    )

    const handleEnterEvent = (e: KeyboardEvent) => pipe(
        e.key === 'Enter' && value.trim() !== '',
        B.fold(
            () => doNothing(),
            () => pipe(
                performIO(() => updateItemForm.requestSubmit()),
                IO.flatMap(() => performIO(() => addItemForm.requestSubmit())),
            )
        )
    )

    const handleValueUpdate = () => pipe(
        value.trim().length > 0,
        B.fold(
            () => doNothing(),
            () => performIO(() => debouncedUpdate()) 
        )
    )

    const handleOwnKeyDown = (e: KeyboardEvent) => sequenceT(IO.Applicative)(
        handleValueUpdate(),
        handleEnterEvent(e),
        handleBackspaceEvent(e)
    )() 

</script>

<div class="flex items-center">
    <i class="
        {item.checked ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}
        mr-3
    "></i>
    <input bind:this={valueInput} class="flex-1 m-3" bind:value={value} on:keydown={handleOwnKeyDown} />
    <p class="mr-3">|</p>
    <form 
        method="post" 
        action="?/searchProduct"
        use:enhance
    >
        <input class="hidden" name="searchTerm" type="text" value={item.value} />
        <button type="submit">Search</button>
    </form>
</div>

<form use:enhance bind:this={addItemForm} class="hidden" method="post" action="?/addItem">
    <input name="value" type="hidden" value={''} />
    <input name="ordinal" type="hidden" value={item.ordinal + 1} />
</form>

<form use:enhance bind:this={updateItemForm} class="hidden" method="post" action="?/updateItem">
    <input name="value" {value} type="hidden" />
    <input name="itemId" value={item.id} type="hidden" />
</form>

<form use:enhance bind:this={deleteItemForm} class="hidden" method="post" action="?/deleteItem">
    <input name="itemId" type="text" value={item.id} />
</form>