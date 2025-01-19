<script>
    let {
        team = {
            name: '',
            draftOrder: 0,
            attackers: [],
            midfielders: [],
            defenders: [],
            keepers: [],
            playerCount: 0,
            traits: [],
            transferBudget: 0
        }
    } = $props();
    let isExpanded = $state(false);
    
    function expanded() {
        isExpanded = !isExpanded;
    }

    function handleViewTeamClick(e) {
        
        return e
        
    }
</script>

<button
    type="button"
    class="team-card"
    class:expanded={isExpanded}
    onclick={expanded}
    onkeydown={e => e.key === 'Enter' && expanded()}
    aria-expanded={isExpanded}
    aria-label={`Team card for ${team.name}`}
>
<div class="team-header">
    <div class="flex justify-between items-center">
        <h3>{team.name}</h3>
            <a 
            href="draft2/teams/{team.name.toLowerCase()}"
            class="view-team-btn"
            onclick={handleViewTeamClick}
        >
            View Team
            </a>
    </div>
    <h4>Draft Position: {team.draftOrder}</h4>
    <h4>Transfer Budget: £{team.transferBudget.toFixed(2)}M</h4>
</div>
    {#if isExpanded}
        <div class="expanded-content">
            <div class="stat-row">
                <span class="label">Total Players:</span>
                <span class="value">{team.playerCount}</span>
            </div>
            <div class="position-group">
                <span class="label">Attackers:</span>
                <div class="player-images">
                    {#each team.attackers as player}
                        <div class="player-image-container">
                            <img src={player.photo} alt={player.name} class="player-photo" />
                            <div class="player-popup">
                                <h5>{player.name || `${player.firstname} ${player.lastname}`}</h5>
                                <p>Age: {player.age}</p>
                                <p>Nationality: {player.nationality}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
            <div class="position-group">
                <span class="label">Midfielders:</span>
                <div class="player-images">
                    {#each team.midfielders as player}
                        <div class="player-image-container">
                            <img src={player.photo} alt={player.name} class="player-photo" />
                            <div class="player-popup">
                                <h5>{player.name || `${player.firstname} ${player.lastname}`}</h5>
                                <p>Age: {player.age}</p>
                                <p>Nationality: {player.nationality}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
            <div class="position-group">
                <span class="label">Defenders:</span>
                <div class="player-images">
                    {#each team.defenders as player}
                        <div class="player-image-container">
                            <img src={player.photo} alt={player.name} class="player-photo" />
                            <div class="player-popup">
                                <h5>{player.name || `${player.firstname} ${player.lastname}`}</h5>
                                <p>Age: {player.age}</p>
                                <p>Nationality: {player.nationality}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
            <div class="position-group">
                <span class="label">Keepers:</span>
                <div class="player-images">
                    {#each team.keepers as player}
                        <div class="player-image-container">
                            <img src={player.photo} alt={player.name} class="player-photo" />
                            <div class="player-popup">
                                <h5>{player.name || `${player.firstname} ${player.lastname}`}</h5>
                                <p>Age: {player.age}</p>
                                <p>Nationality: {player.nationality}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
            <div class="traits-row">
                <span class="label">Club Traits:</span>
                <span class="value">
                    {#if team.traits.length === 0}
                        None
                    {:else}
                        {team.traits.join(', ')}
                    {/if}
                </span>
            </div>
        </div>
    {/if}
</button>

<style>
     .view-team-btn {
        font-size: 0.8rem;
        padding: 0.25rem 0.75rem;
        background-color: #3b82f6;
        color: white;
        border-radius: 4px;
        text-decoration: none;
        transition: background-color 0.2s;
    }

    .view-team-btn:hover {
        background-color: #2563eb;
    }

    /* Add this to ensure proper layout */
    .flex {
        display: flex;
    }

    .justify-between {
        justify-content: space-between;
    }

    .items-center {
        align-items: center;
    }
    
    .team-card {
        width: 300px;
        text-align: left;
        background: white;
        border: 1px solid #e2e8f0;
        padding: 1rem;
        border-radius: 6px;
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        /* Reset button styles */
        appearance: none;
        -webkit-appearance: none;
        font: inherit;
    }

    .team-card:hover {
        background-color: #f8fafc;
    }

    .team-card.expanded {
        background-color: #f8fafc;
    }

    .team-header {
        margin-bottom: 0.5rem;
    }

    .expanded-content {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e2e8f0;
    }

    .stat-row, .position-group {
        display: flex;
        flex-direction: column;
        padding: 0.5rem 0;
    }

    .player-images {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .player-image-container {
        position: relative;
        width: 50px;
        height: 50px;
    }

    .player-photo {
        width: 100%;
        height: 100%;
        border-radius: 25px;
        object-fit: cover;
    }

    .player-popup {
        display: none;
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 0.75rem;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        width: 200px;
        z-index: 10;
    }

    .player-image-container:hover .player-popup {
        display: block;
    }

    .player-popup h5 {
        margin: 0 0 0.5rem 0;
        font-size: 0.9rem;
        font-weight: 600;
    }

    .player-popup p {
        margin: 0.25rem 0;
        font-size: 0.8rem;
        color: #4a5568;
    }

    .traits-row {
        border-top: 1px solid #e2e8f0;
        margin-top: 0.5rem;
        padding-top: 1rem;
    }

    h3 {
        margin: 0;
        font-size: 1.1rem;
        color: #333;
    }

    h4 {
        margin: 0.25rem 0 0 0;
        font-size: 0.9rem;
        color: #666;
    }

    .label {
        font-weight: 500;
        color: #4a5568;
    }

    .value {
        color: #2d3748;
    }
</style>