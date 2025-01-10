<script>
    let {
        team = {
            name: '',
            draftOrder: 0,
            attackers: [],
            midfielders: [],
            defenders: [],
            keepers: [],
            playerCount: 0
        }
    } = $props();

    let isExpanded = $state(false)

    function expanded(){
        isExpanded = !isExpanded
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
        <h3>{team.name}</h3>
        <h4>Draft Position: {team.draftOrder}</h4>
    </div>

    {#if isExpanded}
        <div class="expanded-content">
            <div class="stat-row">
                <span class="label">Total Players:</span>
                <span class="value">{team.playerCount}</span>
            </div>
            <div class="stat-row">
                <span class="label">Attackers:</span>
                <span class="value">{team.attackers}</span>
            </div>
            <div class="stat-row">
                <span class="label">Midfielders:</span>
                <span class="value">{team.midfielders}</span>
            </div>
            <div class="stat-row">
                <span class="label">Defenders:</span>
                <span class="value">{team.defenders}</span>
            </div>
            <div class="stat-row">
                <span class="label">Keepers:</span>
                <span class="value">{team.keepers}</span>
            </div>
        </div>
    {/if}
</button>

<style>
    .team-card {
        width: 300px; /* Fixed width */
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

    .stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
    }

    .label {
        font-weight: 500;
        color: #4a5568;
    }

    .value {
        color: #2d3748;
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
</style>