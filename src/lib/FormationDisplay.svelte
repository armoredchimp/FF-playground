<script>
    import FormationPlayer from "./FormationPlayer.svelte";
    
    let { team = {
        formation: '',
        attackers: [],
        selectedAttackers: [],
        midfielders: [],
        selectedMidfielders: [],
        defenders: [],
        selectedDefenders: [],
        keepers: [],
        selectedKeepers: [],   
    },
        computer = true
    } = $props();
    
    const positionCounts = {
        attackers: 2,
        midfielders: 4,
        defenders: 4,
        keepers: 1
    };

    // Directly push sliced players into selected arrays
    team.selectedAttackers = team.attackers.slice(0, positionCounts.attackers);
    team.selectedMidfielders = team.midfielders.slice(0, positionCounts.midfielders);
    team.selectedDefenders = team.defenders.slice(0, positionCounts.defenders);
    team.selectedKeepers = team.keepers.slice(0, positionCounts.keepers);
</script>

<div class="formation-display">
    <!-- Attackers Row -->
    <div class="position-row attackers-row">
        {#each team.selectedAttackers as [player, statistics, selected]}
            <FormationPlayer {player} {statistics} {computer} {selected}/>
        {/each}
    </div>

    <!-- Midfielders Row -->
    <div class="position-row midfielders-row">
        {#each team.selectedMidfielders as [player, statistics, selected]}
            <FormationPlayer {player} {statistics} {computer} {selected}/>
        {/each}
    </div>

    <!-- Defenders Row -->
    <div class="position-row defenders-row">
        {#each team.selectedDefenders as [player, statistics, selected]}
            <FormationPlayer {player} {statistics} {computer} {selected}/>
        {/each}
    </div>

    <!-- Keeper Row -->
    <div class="position-row keeper-row">
        {#each team.selectedKeepers as [player, statistics, selected]}
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