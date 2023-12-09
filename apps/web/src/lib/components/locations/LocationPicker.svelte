<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ListRecord } from '$lib/interfaces/lists';
	import type { KrogerStoreLocation } from '$lib/interfaces/locations/kroger/store-locations';
	import type { SubmitFunction } from '../../../routes/(logged-in)/lists/[listId]/$types';

	export let list: ListRecord;
	let locationsDropdownOpen = false;

	let locationOptions: KrogerStoreLocation[] = [];

	const handleQueryLocations: SubmitFunction = async () => {
		return ({ result }) => {
			if (result.type === 'success' && result.data?.formId === 'queryLocations') {
				locationOptions = result.data.locationOptions;
			}
		};
	};
</script>

<div class="flex items-center my-2">
	<i class="fa-solid fa-location-dot mr-2"></i>
	<button on:click={() => (locationsDropdownOpen = !locationsDropdownOpen)}>
		{list.location_name.trim().length > 0 ? list.location_name : 'Select a location'}
	</button>
</div>
{#if locationsDropdownOpen}
	<div class="border border-1 my-3 p-3">
		<form class="flex items-center" method="post" use:enhance={handleQueryLocations} action="?/queryLocations">
			<input autocomplete="off" class="flex-1" type="text" name="zipCode" placeholder="Enter a zip code" />
			<button class="border border-black px-3 ml-3" type="submit">Search</button>
		</form>
		{#each locationOptions as locationOption}
			<form method="post" use:enhance action="?/setLocation">
				<input type="hidden" value={locationOption.locationId} name="locationId" />
				<input type="hidden" value={locationOption.name} name="locationName" />
				<button type="submit">{locationOption.name}</button>
			</form>
		{/each}
	</div>
{/if}
