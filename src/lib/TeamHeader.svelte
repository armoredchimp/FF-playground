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
        },
        computer = false
    } = $props();
</script>



<div class="w-full max-w-2xl mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
        <div>
            <h2 class="text-xl font-bold">{team.name} Squad</h2>
            <div class="text-sm text-gray-600 mt-1" style="margin-top: 0.8rem;">
                Draft Position: {team.draftOrder} | Players: {team.playerCount}
            </div>
            {#if computer}
            <div class="text-sm text-gray-600 mt-1" style="margin-top: 0.8rem;">Club Traits: {team.traits.length > 0 ? team.traits : 'None'}</div>
            {/if}
        </div>
    </div>
</div>