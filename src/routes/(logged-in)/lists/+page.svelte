<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';

	export let data;

	let showCreateListModal = false;
</script>

<div class="flex items-center justify-between mt-8">
	<h1 class="font-display text-4xl text-slate-600">Your Lists</h1>
	<button class="hover:text-blue-600" on:click={() => (showCreateListModal = true)}
		>Create new list</button
	>
</div>
<hr class="mb-8" />
{#if data.lists.length === 0}
	<div class="flex flex-col items-center">
		<img class="mt-8 mb-8" alt="Empty list" src="/assets/illustrations/undraw_list.svg" />
		<p class="text-center mb-6 font-body font-thin text-2xl">You don't have any lists yet</p>
		<button class="border px-3" on:click={() => (showCreateListModal = true)}
			>Create a new list</button
		>
	</div>
{:else}
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
		{#each data.lists as list}
            <a href="/lists/{list.id}">
                <div class="border rounded-sm p-3">
                    <h1 class="font-display text-2xl">{list.title}</h1>
                </div>
            </a>
		{/each}
	</div>
{/if}

<Modal bind:showModal={showCreateListModal}>
	<h1 slot="header" class="font-body font-thin">Create a new list</h1>
	<form method="POST" action="?/createList">
		<input class="border px-3" name="title" />
		<button>Create List</button>
	</form>
</Modal>
