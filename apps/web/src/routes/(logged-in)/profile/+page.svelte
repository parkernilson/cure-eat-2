<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
    
</script>

<h1>Profile</h1>
<p>{data.user.name}</p>
<form method="post" action="?/logout">
    <button>log out</button>
</form>