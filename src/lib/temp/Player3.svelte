<script>
    let { 
        player = {
            id: 0,
            name: '',
            age: 0,
            firstname: '',
            lastname: '',
            nationality: '',
            photo: ''
        },
        playerStats = null,
        transferValue = 0
    } = $props();
</script>

<div class="player-card">
    {#if player.photo}
        <img src={player.photo} alt={player.name} class="player-photo" />
    {/if}
    {#if playerStats?.team?.logo}
        <img src={playerStats.team.logo} alt={playerStats.team.name} class="team-logo" />
    {/if}
    
    <div class="info">
        <h3>{player.name || `${player.firstname} ${player.lastname}`}</h3>
        <p>Age: {player.age} • {player.nationality}</p>
        
        <p class="team">{playerStats?.team?.name || 'N/A'}</p>
        
        <div class="stats-section">
            <p>Position: {playerStats?.games?.position || 'N/A'}</p>
            <p>Appearances: {playerStats?.games?.appearences ?? 'N/A'}</p>
            <p>Minutes: {playerStats?.games?.minutes ?? 'N/A'}</p>
            <p>Goals: {playerStats?.goals?.total ?? 'N/A'}</p>
            <p>Assists: {playerStats?.goals?.assists ?? 'N/A'}</p>
            <p>Rating: {Number(playerStats?.games?.rating).toFixed(1) ?? 'N/A'}</p>
            <p>Yellow Cards: {playerStats?.cards?.yellow ?? 'N/A'}</p>
            <p>Red Cards: {playerStats?.cards?.red ?? 'N/A'}</p>
            <p class="transfer-value">Estimated Value: £{transferValue.toFixed(2)}M</p>
        </div>
    </div>
</div>

<style>
    .player-card {
        border: 1px solid #ddd;
        padding: 1rem;
        margin: 0.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .player-photo, .team-logo {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
    }

    .info {
        flex: 1;
    }

    h3 {
        margin: 0;
        font-size: 1.1rem;
    }

    p {
        margin: 0.5rem 0 0;
        color: #666;
    }

    .transfer-value {
        font-weight: bold;
        color: #2d3748;
        margin-top: 1rem;
    }
</style>