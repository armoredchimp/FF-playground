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

<div class="w-full max-w-2xl mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
        <div>
            <h2 class="text-xl font-bold">{team.name} Squad</h2>
            <div class="text-sm text-gray-600 mt-1" style="margin-top: 0.8rem;">
                Draft Position: {team.draftOrder} | Players: {team.playerCount}
            </div>
            <div class="text-sm text-gray-600 mt-1" style="margin-top: 0.8rem;">Club Traits: {team.traits}</div>
        </div>
    </div>

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