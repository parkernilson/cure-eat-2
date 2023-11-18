<script lang="ts">
    import * as IO from 'fp-ts/lib/IO'
    import * as B from 'fp-ts/lib/boolean'
	import type { ListItem, ListItemRecord } from "$lib/interfaces/lists";
	import { sequenceT } from 'fp-ts/lib/Apply';
	import { doNothing, performIO } from '$lib/functions/utils/fp/io';
	import { pipe } from 'fp-ts/lib/function';
	import { traceWithMessage } from '$lib/functions/utils/fp';

    export let item: ListItemRecord
    export let onKeyDown: (e: KeyboardEvent, item: ListItemRecord) => void

    let value: string = item.value

    let deleteItemForm: HTMLFormElement

    const handleBackspaceEvent = (e: KeyboardEvent) => pipe(
        e.key == 'Backspace' && value === '',
        B.fold(
            () => doNothing(),
            () => performIO(() => deleteItemForm.requestSubmit()),
        ),
    )

    const handleOwnKeyDown = (e: KeyboardEvent) => sequenceT(IO.Applicative)(
        performIO(() => onKeyDown(e, item)),
        handleBackspaceEvent(e)
    )() 



</script>

<div class="flex items-center">
    <i class="
        {item.checked ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}
        mr-3
    "></i>
    <input class="flex-1 m-3" bind:value={value} on:keydown={handleOwnKeyDown} />
    <p class="mr-3">|</p>
    <form method="post" action="?/searchProduct">
        <input class="hidden" name="searchTerm" type="text" value={item.value} />
        <button type="submit">Search</button>
    </form>
</div>

<form bind:this={deleteItemForm} class="hidden" method="post" action="?/deleteItem">
    <input name="itemId" type="text" value={item.id} />
</form>