<script lang="ts">
    import { page } from '$app/stores'
</script>

<h1>Oops! Something Went Wrong</h1>
<p>{$page.error?.message ?? "An unexpected error occurred"}</p>