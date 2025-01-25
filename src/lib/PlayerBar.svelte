<script>
    let {
        title,
        players = [],
        position
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

{#if players.length}
    <section>
        <h3 class="font-medium mb-2 text-lg">{title}</h3>
        <div class="space-y-2">
            {#each players as [player, statistics] (player.id)}
                <div class="flex items-center p-3 rounded-lg {getBackgroundColor(position)} hover:shadow-md transition-shadow group relative">
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
                            {player.age} yrs • {player.nationality}
                        </p>
                    </div>
                    
                    
                    <div class="absolute hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 left-3/4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64">
                        <div class="text-sm space-y-2">
                            <div class="flex justify-between items-center w-full border-b pb-2">
                                <span class="font-medium">
                                    {player.name || `${player.firstname} ${player.lastname}`}
                                </span>
                                <span class="text-gray-600">{position}</span>
                            </div>
                            <p>Nationality: {player.nationality}</p>
                            <p>Appearances: {statistics?.games?.appearences ?? 'N/A'}</p>
                            <p>Minutes Played: {statistics?.games?.minutes ?? 'N/A'}</p>
                            <p>Rating: {Number(statistics?.games?.rating || 0).toFixed(1)}</p>
                            
                            {#if position === 'Defender'}
                                <p>Yellow Cards: {statistics?.cards?.yellow ?? 'N/A'}</p>
                                <p>Red Cards: {statistics?.cards?.red ?? 'N/A'}</p>
                                <p>Tackles: {statistics?.tackles?.total ?? 'N/A'}</p>
                                <p>Interceptions: {statistics?.tackles?.interceptions ?? 'N/A'}</p>
                            {/if}
                            
                            {#if position === 'Midfielder'}
                                <p>Key Passes: {statistics?.passes?.key ?? 'N/A'}</p>
                                <p>Pass Accuracy: {statistics?.passes?.accuracy ? `${statistics.passes.accuracy}%` : 'N/A'}</p>
                                <p>Goals: {statistics?.goals?.total ?? 'N/A'}</p>
                                <p>Assists: {statistics?.goals?.assists ?? 'N/A'}</p>
                            {/if}
                            
                            {#if position === 'Attacker'}
                                <p>Goals: {statistics?.goals?.total ?? 'N/A'}</p>
                                <p>Assists: {statistics?.goals?.assists ?? 'N/A'}</p>
                                <p>Shots on Target: {statistics?.shots?.on ?? 'N/A'}</p>
                                <p>Pass Accuracy: {statistics?.passes?.accuracy ? `${statistics.passes.accuracy}%` : 'N/A'}</p>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </section>
{/if}