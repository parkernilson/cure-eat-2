<script lang="ts">
	import { enhance } from "$app/forms";
	import type { ListRecord } from "$lib/interfaces/lists";
	import type { KrogerStoreLocation } from "$lib/interfaces/locations/kroger/store-locations";
	import { id } from "fp-ts/lib/Refinement";
	import type { SubmitFunction } from "../../../routes/(logged-in)/lists/[listId]/$types";

    export let list: ListRecord;
    let locationsDropdownOpen = false;

    let locationOptions: KrogerStoreLocation[] = []

    const handleQueryLocations: SubmitFunction = async ({}) => {
        return ({ result }) => {
            if (result.type === "success" && result.data?.formId === "queryLocations") {
                locationOptions = result.data.locationOptions
            }
        }
    }

</script>

<div class="flex items-center my-2">
	<i class="fa-solid fa-location-dot mr-2"></i>
    <button on:click={() => locationsDropdownOpen = true}>
        {list.location_name.trim().length > 0 ? list.location_name : "Select a location"}
    </button>
</div>
{#if locationsDropdownOpen}
	<div class="border border-1">
        <form method="post" use:enhance={handleQueryLocations} action="?/queryLocations">
            <input type="text" name="zipCode" placeholder="Enter a zip code" />
            <button type="submit">Search</button>
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