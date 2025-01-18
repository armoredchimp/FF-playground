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
            transferBudget: 0
        }
    } = $props();

    let sortBy = $state('position');
    
    let players = $derived.by(() => {
        if (sortBy === 'alphabetical') {
            return [...team.keepers, ...team.defenders, ...team.midfielders, ...team.attackers]
                .sort((a, b) => (a.name || `${a.firstname} ${a.lastname}`)
                    .localeCompare(b.name || `${b.firstname} ${b.lastname}`));
        }
        return null; // null when using position-based display
    });

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
        <h2 class="text-xl font-bold">{team.name} Squad</h2>
        <div class="flex gap-2">
            <button 
                class="px-3 py-1 rounded text-sm font-medium {sortBy === 'position' ? 'bg-blue-500 text-white' : 'bg-gray-200'}"
                onclick={() => sortBy = 'position'}
            >
                By Position
            </button>
            <button 
                class="px-3 py-1 rounded text-sm font-medium {sortBy === 'alphabetical' ? 'bg-blue-500 text-white' : 'bg-gray-200'}"
                onclick={() => sortBy = 'alphabetical'}
            >
                Alphabetical
            </button>
        </div>
    </div>

    <div class="space-y-2">
        {#if sortBy === 'alphabetical' && players}
            {#each players as player (player.id)}
                <div class="flex items-center p-3 rounded-lg bg-gray-100 hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                        {#if player.photo}
                            <img 
                                src={player.photo} 
                                alt={player.name || `${player.firstname} ${player.lastname}`}
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
                            {player.name || `${player.firstname} ${player.lastname}`}
                        </h3>
                        <p class="text-sm text-gray-600">
                            {player.age} yrs
                        </p>
                    </div>
                </div>
            {/each}
        {:else}
            {#if team.keepers.length}
                <div class="mb-4">
                    <h3 class="font-medium mb-2">Goalkeepers</h3>
                    {#each team.keepers as player (player.id)}
                        <div class="flex items-center p-3 rounded-lg {getBackgroundColor('Goalkeeper')} hover:shadow-md transition-shadow mb-2">
                            <div class="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                                {#if player.photo}
                                    <img 
                                        src={player.photo} 
                                        alt={player.name || `${player.firstname} ${player.lastname}`}
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
                                    {player.name || `${player.firstname} ${player.lastname}`}
                                </h3>
                                <p class="text-sm text-gray-600">
                                    {player.age} yrs
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}

            {#if team.defenders.length}
                <div class="mb-4">
                    <h3 class="font-medium mb-2">Defenders</h3>
                    {#each team.defenders as player (player.id)}
                        <div class="flex items-center p-3 rounded-lg {getBackgroundColor('Defender')} hover:shadow-md transition-shadow mb-2">
                            <div class="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                                {#if player.photo}
                                    <img 
                                        src={player.photo} 
                                        alt={player.name || `${player.firstname} ${player.lastname}`}
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
                                    {player.name || `${player.firstname} ${player.lastname}`}
                                </h3>
                                <p class="text-sm text-gray-600">
                                    {player.age} yrs
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}

            {#if team.midfielders.length}
                <div class="mb-4">
                    <h3 class="font-medium mb-2">Midfielders</h3>
                    {#each team.midfielders as player (player.id)}
                        <div class="flex items-center p-3 rounded-lg {getBackgroundColor('Midfielder')} hover:shadow-md transition-shadow mb-2">
                            <div class="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                                {#if player.photo}
                                    <img 
                                        src={player.photo} 
                                        alt={player.name || `${player.firstname} ${player.lastname}`}
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
                                    {player.name || `${player.firstname} ${player.lastname}`}
                                </h3>
                                <p class="text-sm text-gray-600">
                                    {player.age} yrs
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}

            {#if team.attackers.length}
                <div class="mb-4">
                    <h3 class="font-medium mb-2">Attackers</h3>
                    {#each team.attackers as player (player.id)}
                        <div class="flex items-center p-3 rounded-lg {getBackgroundColor('Attacker')} hover:shadow-md transition-shadow mb-2">
                            <div class="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                                {#if player.photo}
                                    <img 
                                        src={player.photo} 
                                        alt={player.name || `${player.firstname} ${player.lastname}`}
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
                                    {player.name || `${player.firstname} ${player.lastname}`}
                                </h3>
                                <p class="text-sm text-gray-600">
                                    {player.age} yrs
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
</div>