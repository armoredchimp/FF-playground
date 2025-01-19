<script>
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
                        <div class="flex items-center p-3 rounded-lg {getBackgroundColor('Goalkeeper')} hover:shadow-md transition-shadow group relative">
                            <div class="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                                {#if keeper.photo}
                                    <img 
                                        src={keeper.photo} 
                                        alt={keeper.name || `${keeper.firstname} ${keeper.lastname}`}
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
                                    {keeper.name || `${keeper.firstname} ${keeper.lastname}`}
                                </h3>
                                <p class="text-sm text-gray-600">
                                    {keeper.age} yrs • {keeper.nationality}
                                </p>
                            </div>
                            
                            <!-- Hover Stats -->
                            <div class="absolute hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 left-full ml-2 top-0 w-64">
                                <div class="text-sm space-y-2">
                                    <p>Nationality: {keeper.nationality}</p>
                                    <p>Appearances: {keeper.statistics?.games?.appearences ?? 'N/A'}</p>
                                    <p>Minutes Played: {keeper.statistics?.games?.minutes ?? 'N/A'}</p>
                                    <p>Rating: {Number(keeper.statistics?.games?.rating || 0).toFixed(1)}</p>
                                </div>
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
                        <div class="flex items-center p-3 rounded-lg {getBackgroundColor('Defender')} hover:shadow-md transition-shadow group relative">
                            <!-- Same structure as keepers but with defender -->
                            <div class="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                                {#if defender.photo}
                                    <img 
                                        src={defender.photo} 
                                        alt={defender.name || `${defender.firstname} ${defender.lastname}`}
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
                                    {defender.name || `${defender.firstname} ${defender.lastname}`}
                                </h3>
                                <p class="text-sm text-gray-600">
                                    {defender.age} yrs • {defender.nationality}
                                </p>
                            </div>
                            
                            <!-- Hover Stats -->
                            <div class="absolute hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 left-full ml-2 top-0 w-64">
                                <div class="text-sm space-y-2">
                                    <p>Nationality: {defender.nationality}</p>
                                    <p>Appearances: {defender.statistics?.games?.appearences ?? 'N/A'}</p>
                                    <p>Minutes Played: {defender.statistics?.games?.minutes ?? 'N/A'}</p>
                                    <p>Rating: {Number(defender.statistics?.games?.rating || 0).toFixed(1)}</p>
                                    <p>Yellow Cards: {defender.statistics?.cards?.yellow ?? 'N/A'}</p>
                                    <p>Red Cards: {defender.statistics?.cards?.red ?? 'N/A'}</p>
                                    <p>Tackles: {defender.statistics?.tackles?.total ?? 'N/A'}</p>
                                    <p>Interceptions: {defender.statistics?.tackles?.interceptions ?? 'N/A'}</p>
                                </div>
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
                        <!-- Same structure as above but with midfielder -->
                        <div class="flex items-center p-3 rounded-lg {getBackgroundColor('Midfielder')} hover:shadow-md transition-shadow group relative">
                            <!-- ... Photo and basic info same as above ... -->
                            <div class="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                                {#if midfielder.photo}
                                    <img 
                                        src={midfielder.photo} 
                                        alt={midfielder.name || `${midfielder.firstname} ${midfielder.lastname}`}
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
                                    {midfielder.name || `${midfielder.firstname} ${midfielder.lastname}`}
                                </h3>
                                <p class="text-sm text-gray-600">
                                    {midfielder.age} yrs • {midfielder.nationality}
                                </p>
                            </div>
                            
                            <!-- Hover Stats -->
                            <div class="absolute hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 left-full ml-2 top-0 w-64">
                                <div class="text-sm space-y-2">
                                    <p>Nationality: {midfielder.nationality}</p>
                                    <p>Appearances: {midfielder.statistics?.games?.appearences ?? 'N/A'}</p>
                                    <p>Minutes Played: {midfielder.statistics?.games?.minutes ?? 'N/A'}</p>
                                    <p>Rating: {Number(midfielder.statistics?.games?.rating || 0).toFixed(1)}</p>
                                    <p>Key Passes: {midfielder.statistics?.passes?.key ?? 'N/A'}</p>
                                    <p>Pass Accuracy: {midfielder.statistics?.passes?.accuracy ? `${midfielder.statistics.passes.accuracy}%` : 'N/A'}</p>
                                    <p>Goals: {midfielder.statistics?.goals?.total ?? 'N/A'}</p>
                                    <p>Assists: {midfielder.statistics?.goals?.assists ?? 'N/A'}</p>
                                </div>
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
                        <div class="flex items-center p-3 rounded-lg {getBackgroundColor('Attacker')} hover:shadow-md transition-shadow group relative">
                            <div class="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                                {#if attacker.photo}
                                    <img 
                                        src={attacker.photo} 
                                        alt={attacker.name || `${attacker.firstname} ${attacker.lastname}`}
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
                                    {attacker.name || `${attacker.firstname} ${attacker.lastname}`}
                                </h3>
                                <p class="text-sm text-gray-600">
                                    {attacker.age} yrs • {attacker.nationality}
                                </p>
                            </div>
                            
                            <!-- Hover Stats -->
                            <div class="absolute hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 left-full ml-2 top-0 w-64">
                                <div class="text-sm space-y-2">
                                    <p>Nationality: {attacker.nationality}</p>
                                    <p>Appearances: {attacker.statistics?.games?.appearences ?? 'N/A'}</p>
                                    <p>Minutes Played: {attacker.statistics?.games?.minutes ?? 'N/A'}</p>
                                    <p>Rating: {Number(attacker.statistics?.games?.rating || 0).toFixed(1)}</p>
                                    <p>Goals: {attacker.statistics?.goals?.total ?? 'N/A'}</p>
                                    <p>Assists: {attacker.statistics?.goals?.assists ?? 'N/A'}</p>
                                    <p>Shots on Target: {attacker.statistics?.shots?.on ?? 'N/A'}</p>
                                    <p>Pass Accuracy: {attacker.statistics?.passes?.accuracy ? `${attacker.statistics.passes.accuracy}%` : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </section>
        {/if}
    </div>
</div>