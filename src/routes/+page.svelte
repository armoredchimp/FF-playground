<script>
    import axios from 'axios';
    import Player from '$lib/temp/Player.svelte';


let teamNumber = $state(0)
let res = $state(null)
let players = $state([])
let teamInfo = $state(null)

async function test(){    
    const options = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/players/squads',
    params: {team: teamNumber},
    headers: {
        'x-rapidapi-key': import.meta.env.VITE_API_KEY,
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
    }
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
        res = response.data
        if (response.data.response && response.data.response.length > 0) {
                players = response.data.response[0].players;
                teamInfo = response.data.response[0].team;
            }
    } catch (error) {
        console.error(error);
    }
}   
</script>


<div class="container">
    <input bind:value={teamNumber}>
    <button class="button" onclick={test}>Click</button>
    <h4 class="page-link"><a href='/draft'>Draft Page</a></h4>
    <h4 class="page-link"><a href='/draft2'>Draft Page 2</a></h4>
    <h4 class="page-link"><a href='/draft3'>Draft Page 3</a></h4>
</div>
{#if teamInfo}
    <h1>{teamInfo.name}</h1>
    <img src={teamInfo.logo} alt="Team Logo" width="100">
{/if}


{#if players && players.length > 0}
<div class="squad-list">
    <h3>Squad List</h3>
    <div class="position-group">
        <h4>Goalkeepers</h4>
        {#each players.filter(p => p.position === 'Goalkeeper') as player}
            <Player {player} />
        {/each}
    </div>
    
    <div class="position-group">
        <h4>Defenders</h4>
        {#each players.filter(p => p.position === 'Defender') as player}
            <Player {player} />
        {/each}
    </div>
    
    <div class="position-group">
        <h4>Midfielders</h4>
        {#each players.filter(p => p.position === 'Midfielder') as player}
            <Player {player} />
        {/each}
    </div>
    
    <div class="position-group">
        <h4>Attackers</h4>
        {#each players.filter(p => p.position === 'Attacker') as player}
            <Player {player} />
        {/each}
    </div>
</div>
{/if}


<style>
    .container {
        display: flex;
        max-width: 800px;
        margin: 0 auto;
        padding: 1rem;
    }

    .button {
        margin-left: 1rem;
    }

    .page-link {
        margin-left: 4rem;
    }
    .team-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin: 2rem 0;
    }

    .position-group {
        margin: 2rem 0;
    }

    h4 {
        color: #666;
        border-bottom: 1px solid #ddd;
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
    }
</style>