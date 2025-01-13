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
            transferBudget: 0
        }
    } = $props();
</script>

<div class="player-team-card">
    <div class="team-header">
        <h3>{team.name}</h3>
        <h4>Draft Position: {team.draftOrder}</h4>
        <h4>Transfer Budget: {team.transferBudget}</h4>
    </div>
    <div class="content">
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
</div>

<style>
    .player-team-card {
        width: 100%;
        text-align: left;
        background: white;
        border: 1px solid #e2e8f0;
        padding: 1.5rem;
        border-radius: 6px;
        background-color: #f8fafc;
        max-width: 400px;
    }
    .team-header {
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #e2e8f0;
    }
    .content {
        margin-top: 1rem;
    }
    .stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
    }
    .label {
        font-weight: 500;
        color: #4a5568;
        font-size: 1.1rem;
    }
    .value {
        color: #2d3748;
        font-size: 1.1rem;
    }
    h3 {
        margin: 0;
        font-size: 1.5rem;
        color: #333;
        font-weight: bold;
    }
    h4 {
        margin: 0.5rem 0 0 0;
        font-size: 1.1rem;
        color: #666;
    }
</style>