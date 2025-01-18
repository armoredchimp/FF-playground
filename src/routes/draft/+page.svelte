<script>
    import axios from 'axios';
    import Player2 from '$lib/Player2.svelte';
	

    let playersPool = $state()
    let page = $state(1)
    let loading = $state(false)

    async function getPlayers(){
        if (loading) return;
        const options = {
            method: 'GET',
            url: 'https://api-football-v1.p.rapidapi.com/v3/players',
            params: {
                league: '39',
                season: '2023',
                page
            },
            headers: {
                'x-rapidapi-key': import.meta.env.VITE_API_KEY,
                'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            console.log(response.data);
            if (response.data.response?.length) {
                const newPlayers = response.data.response.map(item=>({
                    player: { ...item.player },
                    statistics: [...item.statistics]
                }))
            playersPool = (playersPool || []).concat(newPlayers)
            page++;
                }
            
        } catch (error) {
            console.error(error);
        } finally {
            loading = false;
        }
    }

</script>

<h4 class="page-link"><a href='/'>Home</a></h4>
<button onclick={getPlayers} disabled={loading}>Get Players</button>

{#if playersPool && playersPool.length > 0}
    <div class="playerContainer">
        <h3>Players List</h3>

            <div class="group">
                {#each playersPool as p}
                    <Player2 player ={p.player} />
                {/each}
            </div>
            

    </div>  
    <button onclick={getPlayers} disabled={loading}>{loading ? 'Loading...' : 'Load More'}</button>
{/if}