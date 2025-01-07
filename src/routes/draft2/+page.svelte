<script>
    import axios from "axios";
    import Player4 from "$lib/Player4.svelte";
   
    let processedPlayers = $state([]); 
    let loading = $state(false);
    let progress = $state({ current: 0, total: 0 });

    function calculateTransferValue(player, statistics) {
    // Base value in millions
    let baseValue = 2.0;
    
    const stats = statistics;
    if (!stats) return baseValue;

    // Calculate minutes per 90
    const minutes = stats.games?.minutes || 0;
    const gamesPlayed90 = minutes / 90;
    if (gamesPlayed90 < 1) return 0.1;

    // Age factor (reduced impact)
    const ageFactor = Math.max(0.8, 1 - (Math.abs(player.age - 26) * 0.025));

    // Game time value with increased appearance and minutes impact
    const appearanceBonus = Math.min(1.0, (stats.games?.appearences || 0) * 0.04); 
    const minutesValue = (stats.games?.minutes || 0) * 0.0004; 

    // Rating impact (centered around 6.6)
    const rating = Number(stats.games?.rating || 6.6);
    const ratingDiff = rating - 6.6;
    const ratingMultiplier = ratingDiff > 0 ? 
        1 + (ratingDiff * 0.4) :  
        1 + (ratingDiff * 0.5);   

    // Offensive contributions (per 90)
    const goalsValue = ((stats.goals?.total || 0) / gamesPlayed90) * 1.5;
    const assistsValue = ((stats.goals?.assists || 0) / gamesPlayed90) * 1.0; 
    const shotAccuracy = (stats.shots?.on || 0) / (stats.shots?.total || 1) * 1.0;
    
    // Passing & Creation (per 90)
    const passValue = ((stats.passes?.total || 0) / gamesPlayed90) * 0.002;
    const keyPassValue = ((stats.passes?.key || 0) / gamesPlayed90) * 0.4;
    
    // Defensive contributions (per 90)
    const tackleValue = ((stats.tackles?.total || 0) / gamesPlayed90) * 0.1;
    const interceptValue = ((stats.tackles?.interceptions || 0) / gamesPlayed90) * 0.1;
    const blockValue = ((stats.tackles?.blocks || 0) / gamesPlayed90) * 0.1;
    
    // Goalkeeper specific
    const savesValue = ((stats.goals?.saves || 0) / gamesPlayed90) * 0.15;
    const cleanSheetBonus = (stats.goals?.conceded === 0 ? 1.5 : 0);
    
    // Duel success
    const duelValue = stats.duels?.total ? 
        ((stats.duels.won || 0) / stats.duels.total) * 1.0 : 0;
    
    // Discipline penalty (per 90)
    const disciplineValue = (
        ((stats.cards?.yellow || 0) / gamesPlayed90 * -0.2) + 
        ((stats.cards?.red || 0) / gamesPlayed90 * -1.0)
    );

    // Sum all contributions (before rating multiplier)
    const rawValue = (baseValue + 
        appearanceBonus + 
        minutesValue + 
        goalsValue + 
        assistsValue + 
        shotAccuracy + 
        passValue + 
        keyPassValue + 
        tackleValue + 
        interceptValue + 
        blockValue + 
        savesValue + 
        cleanSheetBonus + 
        duelValue + 
        disciplineValue);

    // Apply age factor and rating multiplier
    const totalValue = rawValue * ageFactor * ratingMultiplier;

    return Math.max(totalValue, 0.1);
}
    async function fetchAndProcessPlayers() {
        if (loading) return;
        loading = true;
        const tempContainer = [];
       
        try {
            const initialOptions = {
                method: 'GET',
                url: 'https://api-football-v1.p.rapidapi.com/v3/players',
                params: {
                    league: '39',
                    season: '2023',
                    page: 1
                },
                headers: {
                    'x-rapidapi-key': import.meta.env.VITE_API_KEY,
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
                }
            };

            const firstResponse = await axios.request(initialOptions);
            progress.total = firstResponse.data.paging.total;
            
            if (firstResponse.data.response?.length) {
                processPlayersData(firstResponse.data.response, tempContainer);
            }

            for (let i = 2; i <= progress.total; i++) {
                progress.current = i;
                const options = {
                    ...initialOptions,
                    params: {
                        ...initialOptions.params,
                        page: i
                    }
                };
                
                const response = await axios.request(options);
                if (response.data.response?.length) {
                    processPlayersData(response.data.response, tempContainer);
                }
            }
            
            processedPlayers = tempContainer.sort((a, b) => b.transferValue - a.transferValue);
            console.log(`Successfully processed ${processedPlayers.length} Premier League players`);
            
        } catch (err) {
            console.error('Error:', err);
        } finally {
            loading = false;
        }
    }

    function processPlayersData(players, container) {
        for (const item of players) {
            const eplStats = item.statistics.find(stat => 
                stat.league.name === 'Premier League' && 
                stat.games.appearences !== null
            );

            if (eplStats) {
                container.push({
                    player: item.player,
                    statistics: eplStats,
                    transferValue: calculateTransferValue(item.player, eplStats)
                });
            }
        }
    }
</script>

<h4 class="page-link"><a href='/'>Home</a></h4>

<button 
    onclick={fetchAndProcessPlayers} 
    disabled={loading}
>
    {loading ? `Processing players... (${progress.current}/${progress.total})` : 'Get Premier League Players'}
</button>

{#if processedPlayers.length > 0}
    <div class="players-container">
        <h3>Premier League Players by Transfer Value ({processedPlayers.length})</h3>
        {#each processedPlayers as {player, statistics, transferValue}}
            <Player4 
                player={player}
                playerStats={statistics}
                transferValue={transferValue}
            />
        {/each}
    </div>
{/if}

<style>
    .players-container {
        padding: 1rem;
        max-width: 800px;
        margin: 0 auto;
    }
</style>