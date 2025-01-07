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

    let isExpanded = $state(false);

    function toggleExpand() {
        isExpanded = !isExpanded;
    }
</script>

<button 
    type="button"
    class="player-card" 
    class:expanded={isExpanded}
    onclick={toggleExpand}
    onkeydown={e => e.key === 'Enter' && toggleExpand()}
    aria-expanded={isExpanded}
    aria-label={`Player card for ${player.name || `${player.firstname} ${player.lastname}`}`}
>
    <div class="info">
        <div class="name-value">
            <h3>{player.name || `${player.firstname} ${player.lastname}`}</h3>
            <p class="transfer-value">£{transferValue.toFixed(2)}M</p>
        </div>
        <div class="details">
            <span>{player.age} yrs</span>
            <span>•</span>
            <span>{playerStats?.team?.name || 'N/A'}</span>
            <span>•</span>
            <span>{playerStats?.games?.position || 'N/A'}</span>
            <span>•</span>
            <span>Rating: {Number(playerStats?.games?.rating || 0).toFixed(1)}</span>
        </div>

        {#if isExpanded}
            <div class="expanded-content">
                <div class="photo-section">
                    {#if player.photo}
                        <img src={player.photo} alt={player.name} class="player-photo" />
                    {/if}
                </div>
                <div class="expanded-stats">
                    <p>Nationality: {player.nationality}</p>
                    <p>Appearances: {playerStats?.games?.appearences ?? 'N/A'}</p>
                    <p>Minutes Played: {playerStats?.games?.minutes ?? 'N/A'}</p>
                    <p>Goals: {playerStats?.goals?.total ?? 'N/A'}</p>
                    <p>Assists: {playerStats?.goals?.assists ?? 'N/A'}</p>
                    <p>Yellow Cards: {playerStats?.cards?.yellow ?? 'N/A'}</p>
                    <p>Red Cards: {playerStats?.cards?.red ?? 'N/A'}</p>
                    <p>Tackles: {playerStats?.tackles?.total ?? 'N/A'}</p>
                    <p>Interceptions: {playerStats?.tackles?.interceptions ?? 'N/A'}</p>
                    <p>Key Passes: {playerStats?.passes?.key ?? 'N/A'}</p>
                    <p>Pass Accuracy: {playerStats?.passes?.accuracy ? `${playerStats.passes.accuracy}%` : 'N/A'}</p>
                </div>
            </div>
        {/if}
    </div>
</button>

<style>
    .player-card {
        width: 100%;
        text-align: left;
        background: white;
        border: 1px solid #e2e8f0;
        padding: 0.75rem;
        border-radius: 6px;
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        /* Reset button styles */
        appearance: none;
        -webkit-appearance: none;
        font: inherit;
    }

    .player-card:hover {
        background-color: #f8fafc;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .player-card.expanded {
        background-color: #f8fafc;
        padding: 1rem;
    }

    .info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .name-value {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
    }

    .details {
        display: flex;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: #64748b;
        flex-wrap: wrap;
    }

    .transfer-value {
        margin: 0;
        font-weight: 600;
        color: #2d3748;
        white-space: nowrap;
    }

    span {
        white-space: nowrap;
    }

    .expanded-content {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e2e8f0;
        display: flex;
        gap: 1.5rem;
    }

    .photo-section {
        flex-shrink: 0;
    }

    .player-photo {
        width: 120px;
        height: 120px;
        border-radius: 60px;
        object-fit: cover;
    }

    .expanded-stats {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 0.5rem;
        flex-grow: 1;
    }

    .expanded-stats p {
        margin: 0;
        color: #4a5568;
    }
</style>