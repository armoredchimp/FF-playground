<script>
    import PlayerBar from "./PlayerBar.svelte";
    
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
    
</script>

<div class="player-list-container">
    <div class="space-y-4">
        <PlayerBar 
            title="Attackers"
            players={team.attackers}
            position="Attacker"
        />
        
        <PlayerBar 
            title="Midfielders"
            players={team.midfielders}
            position="Midfielder"
        />
        
        <PlayerBar 
            title="Defenders"
            players={team.defenders}
            position="Defender"
        />

        <PlayerBar 
            title="Goalkeepers"
            players={team.keepers}
            position="Goalkeeper"
        />
    </div>
</div>

<style>
    .player-list-container {
        min-width: 500px;
        flex: 1;
        padding: 0 1rem;
    }
</style>