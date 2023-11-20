<script lang="ts">
	import { doNothing, performIO } from "$lib/functions/utils/fp/io";
	import { pipe } from "fp-ts/lib/function";
    import * as B from 'fp-ts/lib/boolean'
	import { onMount } from "svelte";

    export let placeholder: string | null = null

    export let ordinal: number
    let value: string

    let newItemForm: HTMLFormElement
    let newItemInput: HTMLInputElement

    const handleNewItemKeyDown = (e: KeyboardEvent) =>
		pipe(
			e.key == 'Enter' && value.trim() !== '',
			B.fold(
				() => doNothing(),
				() =>
					performIO(() => {
						newItemForm.submit();
					})
			)
		)();

    onMount(() => newItemInput.focus())

</script>


<div class="flex items-center">
    <i
        class="
        fa-regular fa-circle
        mr-3
    "
    />
    <form bind:this={newItemForm} method="post" action="?/addItem" on:submit|preventDefault>
        <input
            class="flex-1 m-3"
            name="value"
            bind:value={value}
            bind:this={newItemInput}
            on:keydown={handleNewItemKeyDown}
            {placeholder}
        />
        <input value={ordinal} name="ordinal" type="hidden" />
    </form>
</div>