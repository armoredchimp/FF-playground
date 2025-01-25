<script>
    import FormationPlayer from "./FormationPlayer.svelte";
    
    let { team = {
        formation: '',
        attackers: [],
        midfielders: [],
        defenders: [],
        keepers: []    
    },
        computer = true
        } = $props();
    
    const positionCounts = {
        attackers: 2,
        midfielders: 4,
        defenders: 4,
        keepers: 1
    };

    const displayPositions = {
        attackers: team.attackers.slice(0, positionCounts.attackers),
        midfielders: team.midfielders.slice(0, positionCounts.midfielders),
        defenders: team.defenders.slice(0, positionCounts.defenders),
        keepers: team.keepers.slice(0, positionCounts.keepers)
    };
</script>

<div class="formation-display">
    <!-- Attackers Row -->
    <div class="position-row attackers-row">
        {#each displayPositions.attackers as [player, statistics, selected]}
            <FormationPlayer {player} {statistics} {computer} {selected}/>
        {/each}
    </div>

    <!-- Midfielders Row -->
    <div class="position-row midfielders-row">
        {#each displayPositions.midfielders as [player, statistics, selected]}
            <FormationPlayer {player} {statistics} {computer} {selected}/>
        {/each}
    </div>

    <!-- Defenders Row -->
    <div class="position-row defenders-row">
        {#each displayPositions.defenders as [player, statistics, selected]}
            <FormationPlayer {player} {statistics} {computer} {selected}/>
        {/each}
    </div>

    <!-- Keeper Row -->
    <div class="position-row keeper-row">
        {#each displayPositions.keepers as [player, statistics, selected]}
            <FormationPlayer {player} {statistics} {computer} {selected}/>
        {/each}
    </div>
</div>

<style>
    .formation-display {
        width: 100%;
        max-width: 900px; 
        height: 850px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0.5rem;
        background-color: #f0f9f0;
        border-radius: 8px;
    }

    .position-row {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
    }

    .attackers-row {
        margin-top: 2rem;
    }

    .midfielders-row {
        margin-top: 4rem;
    }

    .defenders-row {
        margin-top: 4rem;
    }

    .keeper-row {
        margin-top: 4rem;
        margin-bottom: 2rem;
    }
</style>