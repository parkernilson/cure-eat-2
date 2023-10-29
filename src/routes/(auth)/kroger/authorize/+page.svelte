<script lang="ts">
    import { PUBLIC_KROGER_CLIENT_ID } from '$env/static/public';

    const krogerAuthUrl = new URL(`https://api.kroger.com/v1/connect/oauth2/authorize`);
    krogerAuthUrl.searchParams.append(`scope`, `cart.basic:write`)
    krogerAuthUrl.searchParams.append(`client_id`, `${PUBLIC_KROGER_CLIENT_ID}`)
    krogerAuthUrl.searchParams.append(`redirect_uri`, `https://cureeat.com/kroger/authorize`)
    krogerAuthUrl.searchParams.append(`response_type`, `code`)
    krogerAuthUrl.searchParams.append(`state`, `test`) // TODO: This state must be secure. I am using a constant value for testing

</script>



<!-- TODO: Temporary, move this to a more appropriate place -->
<h1>Kroger authorization</h1>
<a href={krogerAuthUrl.toString()}>Authorize me</a>