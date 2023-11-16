<script lang="ts">
	import type { ListRecord } from '$lib/interfaces/lists';
	import { LIST_COLORS } from '$lib/constants/ui';
	import Modal from '$lib/components/ui/Modal.svelte';

	export let list: ListRecord;

	let showDeleteListModal = false;
</script>

<div class="flex border rounded-sm p-3 {LIST_COLORS[list.color].bgColor}">
	<a class="flex-1" href="/lists/{list.id}">
		<div class="">
			<h1 class="font-display text-2xl">{list.title}</h1>
			{#if list.items.length === 0}
				<p class="font-body">This list is empty</p>
			{:else}
				<p class="font-body">This list has {list.items.length} items</p>
			{/if}
		</div>
	</a>
	<div>
		<button
			class="
            flex items-center justify-center w-5 h-5 rounded-full
            hover:bg-slate-200
        "
			on:click={() => (showDeleteListModal = true)}
		>
			<i class="fa-solid fa-trash" />
		</button>
	</div>
</div>

<Modal bind:showModal={showDeleteListModal}>
	<h1 slot="header" class="font-body text-xl">Delete list</h1>
    <p class="font-body text-xl text-center mt-8 mb-8">Are you sure you want to delete this list?</p>
	<form method="POST" action="?/deleteList">
		<input type="hidden" name="listId" value={list.id} />
		<div class="flex justify-around mb-4">
			<button class="border flex-1 hover:shadow-sm hover:text-blue-600" type="submit">Delete</button
			>
			<button class="flex-1 hover:text-blue-600" on:click={() => (showDeleteListModal = false)}
				>Cancel</button
			>
		</div>
	</form>
</Modal>
