<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import ListItem from '$lib/components/lists/ListItem.svelte';
	import * as TE from 'fp-ts/lib/TaskEither';
	import * as B from 'fp-ts/lib/boolean';
	import type { ListItemRecord } from '$lib/interfaces/lists';
	import { pipe } from 'fp-ts/lib/function.js';
	import type { SubmitFunction } from './$types.js';
	import { toError } from 'fp-ts/lib/Either.js';
	import type { ActionResult } from '@sveltejs/kit';
	import { performIO } from '$lib/functions/utils/fp/io.js';

	export let data;

	const listItemInputs: HTMLInputElement[] = [];

	const sortByOrdinal = (a: ListItemRecord, b: ListItemRecord) => a.ordinal - b.ordinal;

	const addItemSubmit: SubmitFunction = ({}) => async ({ result }) => {
		await invalidateAll()
		if (result.type === 'success' && result.data?.formId === 'addItem') {
			const { ordinal } = result.data.listItemRecord
			listItemInputs[ordinal]?.focus()
		}
	}

</script>

<div class="flex items-center mt-8">
	<h1 class="font-display text-4xl text-slate-600">{data.list.title}</h1>
</div>
<hr class="mb-8" />

{#if data.list.items.length === 0}
	<form method="post" action="?/addItem">
		<input name="ordinal" value={0} type="hidden" />
		<input name="value" value={''} type="hidden" />
		<button>Tap to create your first item</button>
	</form>
{/if}

{#each data.list.items.sort(sortByOrdinal) as item, i (item.id)}
	<ListItem bind:valueInput={listItemInputs[i]} {item} {addItemSubmit} />

	{#if i < data.list.items.length - 1}
		<hr />
	{/if}
{/each}
