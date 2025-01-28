<script>
    import FormationPlayer from "./FormationPlayer.svelte";
    
    let { team = {
        formation: '',
        attackers: [],
        midfielders: [],
        defenders: [],
        keepers: [],
        selected: [],
        formationDisplayed: false  
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
    if(!team.formationDisplayed){
        team.selected[0] = team.attackers.slice(0, positionCounts.attackers);
        team.selected[1] = team.midfielders.slice(0, positionCounts.midfielders);
        team.selected[2] = team.defenders.slice(0, positionCounts.defenders);
        team.selected[3] = team.keepers.slice(0, positionCounts.keepers);
        team.formationDisplayed = true
    }
</script>
<h4>{team.formationDisplayed}</h4>
<div class="formation-display">
    <!-- Attackers Row -->
    <div class="position-row attackers-row">
        {#each team.selected[0] as [player, statistics]}
            <FormationPlayer {player} {statistics} {computer}/>
        {/each}
    </div>

    <!-- Midfielders Row -->
    <div class="position-row midfielders-row">
        {#each team.selected[1] as [player, statistics]}
            <FormationPlayer {player} {statistics} {computer}/>
        {/each}
    </div>

    <!-- Defenders Row -->
    <div class="position-row defenders-row">
        {#each team.selected[2] as [player, statistics]}
            <FormationPlayer {player} {statistics} {computer}/>
        {/each}
    </div>

    <!-- Keeper Row -->
    <div class="position-row keeper-row">
        {#each team.selected[3] as [player, statistics]}
            <FormationPlayer {player} {statistics} {computer}/>
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