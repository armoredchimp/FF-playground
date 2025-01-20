<script>
    import { getAllPlayers } from "./stores.svelte";
    
    let {
        team = {
            name: '',
            attackers: [],
            midfielders: [],
            defenders: [],
            keepers: [],
            playerCount: 0,
            traits: [],
            transferBudget: 0,
            draftOrder: 0
        }
    } = $props();
    
    function getBackgroundColor(position) {
        switch (position) {
            case 'Goalkeeper': return 'bg-yellow-100';
            case 'Defender': return 'bg-blue-100';
            case 'Midfielder': return 'bg-green-100';
            case 'Attacker': return 'bg-red-100';
            default: return 'bg-gray-100';
        }
    }
</script>

<div class="w-full max-w-2xl mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
        <div>
            <h2 class="text-xl font-bold">{team.name} Squad</h2>
            <div class="text-sm text-gray-600 mt-1">
                Draft Position: {team.draftOrder} | Players: {team.playerCount}
            </div>
            <div class="text-sm text-gray-600 mt-1">
                Traits: {team.traits.length ? team.traits.join(', ') : 'None'}
            </div>
        </div>
    </div>

    <div class="space-y-4">
        {#if team.keepers.length}
            <section>
                <h3 class="font-medium mb-2 text-lg">Goalkeepers</h3>
                <div class="space-y-2">
                    {#each team.keepers as keeper (keeper.id)}
                        {@const playerDetails = getAllPlayers().getPlayerById(keeper.id)}
                        <div class="flex items-center p-3 rounded-lg {getBackgroundColor('Goalkeeper')} hover:shadow-md transition-shadow group relative">
                            <div class="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                                {#if playerDetails?.player.photo}
                                    <img 
                                        src={playerDetails.player.photo} 
                                        alt={playerDetails.player.name || `${playerDetails.player.firstname} ${playerDetails.player.lastname}`}
                                        class="w-full h-full object-cover"
                                    />
                                {:else}
                                    <div class="w-full h-full flex items-center justify-center text-gray-500">
                                        <span class="text-xl">👤</span>
                                    </div>
                                {/if}
                            </div>
                            <div class="flex-1">
                                <h3 class="font-medium">
                                    {playerDetails ? (playerDetails.player.name || `${playerDetails.player.firstname} ${playerDetails.player.lastname}`) : 'Loading...'}
                                </h3>
                                <p class="text-sm text-gray-600">
                                    {playerDetails ? `${playerDetails.player.age} yrs • ${playerDetails.player.nationality}` : 'Loading...'}
                                </p>
                            </div>
                            
                            <!-- Hover Stats -->
                            <div class="absolute hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 left-full ml-2 top-0 w-64">
                                {#if playerDetails}
                                    <div class="text-sm space-y-2">
                                        <p>Nationality: {playerDetails.player.nationality}</p>
                                        <p>Appearances: {playerDetails.statistics?.games?.appearences ?? 'N/A'}</p>
                                        <p>Minutes Played: {playerDetails.statistics?.games?.minutes ?? 'N/A'}</p>
                                        <p>Rating: {Number(playerDetails.statistics?.games?.rating || 0).toFixed(1)}</p>
                                    </div>
                                {:else}
                                    <div class="text-sm">Loading player details...</div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </section>
        {/if}

        {#if team.defenders.length}
            <section>
                <h3 class="font-medium mb-2 text-lg">Defenders</h3>
                <div class="space-y-2">
                    {#each team.defenders as defender (defender.id)}
                        {@const playerDetails = getAllPlayers().getPlayerById(defender.id)}
                        <div class="flex items-center p-3 rounded-lg {getBackgroundColor('Defender')} hover:shadow-md transition-shadow group relative">
                            <div class="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                                {#if playerDetails?.player.photo}
                                    <img 
                                        src={playerDetails.player.photo} 
                                        alt={playerDetails.player.name || `${playerDetails.player.firstname} ${playerDetails.player.lastname}`}
                                        class="w-full h-full object-cover"
                                    />
                                {:else}
                                    <div class="w-full h-full flex items-center justify-center text-gray-500">
                                        <span class="text-xl">👤</span>
                                    </div>
                                {/if}
                            </div>
                            <div class="flex-1">
                                <h3 class="font-medium">
                                    {playerDetails ? (playerDetails.player.name || `${playerDetails.player.firstname} ${playerDetails.player.lastname}`) : 'Loading...'}
                                </h3>
                                <p class="text-sm text-gray-600">
                                    {playerDetails ? `${playerDetails.player.age} yrs • ${playerDetails.player.nationality}` : 'Loading...'}
                                </p>
                            </div>
                            
                            <!-- Hover Stats -->
                            <div class="absolute hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 left-full ml-2 top-0 w-64">
                                {#if playerDetails}
                                    <div class="text-sm space-y-2">
                                        <p>Nationality: {playerDetails.player.nationality}</p>
                                        <p>Appearances: {playerDetails.statistics?.games?.appearences ?? 'N/A'}</p>
                                        <p>Minutes Played: {playerDetails.statistics?.games?.minutes ?? 'N/A'}</p>
                                        <p>Rating: {Number(playerDetails.statistics?.games?.rating || 0).toFixed(1)}</p>
                                        <p>Yellow Cards: {playerDetails.statistics?.cards?.yellow ?? 'N/A'}</p>
                                        <p>Red Cards: {playerDetails.statistics?.cards?.red ?? 'N/A'}</p>
                                        <p>Tackles: {playerDetails.statistics?.tackles?.total ?? 'N/A'}</p>
                                        <p>Interceptions: {playerDetails.statistics?.tackles?.interceptions ?? 'N/A'}</p>
                                    </div>
                                {:else}
                                    <div class="text-sm">Loading player details...</div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </section>
        {/if}

        {#if team.midfielders.length}
            <section>
                <h3 class="font-medium mb-2 text-lg">Midfielders</h3>
                <div class="space-y-2">
                    {#each team.midfielders as midfielder (midfielder.id)}
                        {@const playerDetails = getAllPlayers().getPlayerById(midfielder.id)}
                        <div class="flex items-center p-3 rounded-lg {getBackgroundColor('Midfielder')} hover:shadow-md transition-shadow group relative">
                            <div class="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                                {#if playerDetails?.player.photo}
                                    <img 
                                        src={playerDetails.player.photo} 
                                        alt={playerDetails.player.name || `${playerDetails.player.firstname} ${playerDetails.player.lastname}`}
                                        class="w-full h-full object-cover"
                                    />
                                {:else}
                                    <div class="w-full h-full flex items-center justify-center text-gray-500">
                                        <span class="text-xl">👤</span>
                                    </div>
                                {/if}
                            </div>
                            <div class="flex-1">
                                <h3 class="font-medium">
                                    {playerDetails ? (playerDetails.player.name || `${playerDetails.player.firstname} ${playerDetails.player.lastname}`) : 'Loading...'}
                                </h3>
                                <p class="text-sm text-gray-600">
                                    {playerDetails ? `${playerDetails.player.age} yrs • ${playerDetails.player.nationality}` : 'Loading...'}
                                </p>
                            </div>
                            
                            <!-- Hover Stats -->
                            <div class="absolute hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 left-full ml-2 top-0 w-64">
                                {#if playerDetails}
                                    <div class="text-sm space-y-2">
                                        <p>Nationality: {playerDetails.player.nationality}</p>
                                        <p>Appearances: {playerDetails.statistics?.games?.appearences ?? 'N/A'}</p>
                                        <p>Minutes Played: {playerDetails.statistics?.games?.minutes ?? 'N/A'}</p>
                                        <p>Rating: {Number(playerDetails.statistics?.games?.rating || 0).toFixed(1)}</p>
                                        <p>Key Passes: {playerDetails.statistics?.passes?.key ?? 'N/A'}</p>
                                        <p>Pass Accuracy: {playerDetails.statistics?.passes?.accuracy ? `${playerDetails.statistics.passes.accuracy}%` : 'N/A'}</p>
                                        <p>Goals: {playerDetails.statistics?.goals?.total ?? 'N/A'}</p>
                                        <p>Assists: {playerDetails.statistics?.goals?.assists ?? 'N/A'}</p>
                                    </div>
                                {:else}
                                    <div class="text-sm">Loading player details...</div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </section>
        {/if}

        {#if team.attackers.length}
            <section>
                <h3 class="font-medium mb-2 text-lg">Attackers</h3>
                <div class="space-y-2">
                    {#each team.attackers as attacker (attacker.id)}
                        {@const playerDetails = getAllPlayers().getPlayerById(attacker.id)}
                        <div class="flex items-center p-3 rounded-lg {getBackgroundColor('Attacker')} hover:shadow-md transition-shadow group relative">
                            <div class="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                                {#if playerDetails?.player.photo}
                                    <img 
                                        src={playerDetails.player.photo} 
                                        alt={playerDetails.player.name || `${playerDetails.player.firstname} ${playerDetails.player.lastname}`}
                                        class="w-full h-full object-cover"
                                    />
                                {:else}
                                    <div class="w-full h-full flex items-center justify-center text-gray-500">
                                        <span class="text-xl">👤</span>
                                    </div>
                                {/if}
                            </div>
                            <div class="flex-1">
                                <h3 class="font-medium">
                                    {playerDetails ? (playerDetails.player.name || `${playerDetails.player.firstname} ${playerDetails.player.lastname}`) : 'Loading...'}
                                </h3>
                                <p class="text-sm text-gray-600">
                                    {playerDetails ? `${playerDetails.player.age} yrs • ${playerDetails.player.nationality}` : 'Loading...'}
                                </p>
                            </div>
                            
                            <!-- Hover Stats -->
                            <div class="absolute hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 left-full ml-2 top-0 w-64">
                                {#if playerDetails}
                                    <div class="text-sm space-y-2">
                                        <p>Nationality: {playerDetails.player.nationality}</p>
                                        <p>Appearances: {playerDetails.statistics?.games?.appearences ?? 'N/A'}</p>
                                        <p>Minutes Played: {playerDetails.statistics?.games?.minutes ?? 'N/A'}</p>
                                        <p>Rating: {Number(playerDetails.statistics?.games?.rating || 0).toFixed(1)}</p>
                                        <p>Goals: {playerDetails.statistics?.goals?.total ?? 'N/A'}</p>
                                        <p>Assists: {playerDetails.statistics?.goals?.assists ?? 'N/A'}</p>
                                        <p>Shots on Target: {playerDetails.statistics?.shots?.on ?? 'N/A'}</p>
                                        <p>Pass Accuracy: {playerDetails.statistics?.passes?.accuracy ? `${playerDetails.statistics.passes.accuracy}%` : 'N/A'}</p>
                                    </div>
                                {:else}
                                    <div class="text-sm">Loading player details...</div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </section>
        {/if}
    </div>
</div>