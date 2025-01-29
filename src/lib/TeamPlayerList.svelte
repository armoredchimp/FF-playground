<script>
    import PlayerBarGroup from "./PlayerBarGroup.svelte";
    
    let {
        team = {
            name: '',
            draftOrder: 0,
            attackers: [],
            midfielders: [],
            defenders: [],
            keepers: [],
            selected: [],
            playerCount: 0,
            traits: [],
            transferBudget: 0
        }
    } = $props();
    
</script>

<div class="player-list-container">
    <div class="space-y-4">
        <PlayerBarGroup 
            title="Attackers"
            selected={team.selected[0]}
            players={team.attackers}
            position="Attacker"
        />
        
        <PlayerBarGroup 
            title="Midfielders"
            selected={team.selected[1]}
            players={team.midfielders}
            position="Midfielder"
        />
        
        <PlayerBarGroup
            title="Defenders"
            selected={team.selected[2]}
            players={team.defenders}
            position="Defender"
        />

        <PlayerBarGroup 
            title="Goalkeepers"
            selected={team.selected[3]}
            players={team.keepers}
            position="Goalkeeper"
        />
    </div>
</div>

<style>
    .player-list-container {
        min-width: 500px;
        max-width: 800px;
        margin: 0 auto;
        flex: 1;
        padding: 0 1rem;
    }
</style>