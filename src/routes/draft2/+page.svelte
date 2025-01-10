<script>
    import axios from "axios";
    import Player4 from "$lib/Player4.svelte";
    import Team from "$lib/Team.svelte";
    import { teams } from "$lib/teams.svelte";
    import { firstParts, secondParts, commonNames } from "$lib/clubNameData.svelte"
   
    let playerTeam = $state({
        name: '',
        draftOrder: 0,
        attackers: [],
        midfielders: [],
        defenders: [],
        keepers: [],
        playerCount: 0
    })


    let processedPlayers = $state([]); 
    let loading = $state(false);
    let progress = $state({ current: 0, total: 0 });
    let complete = $state(false)
    let gate1 = $state(false)

    let numberPool = Array.from({length:14}, (_,i) => i+1);

    const fP = firstParts;
    const sP = secondParts

    // Track how many times each first name is used
    const firstNameCounts = {};

    // Track which second names (except common ones) have been used
    const usedSecondNames = new Set();


    function generateClubName() {
        // Get available first names (used less than twice)
        const availableFirsts = firstParts.filter(name => 
            !firstNameCounts[name] || firstNameCounts[name] < 2
        );
        
        // Pick random first name
        const firstName = availableFirsts[Math.floor(Math.random() * availableFirsts.length)];
        firstNameCounts[firstName] = (firstNameCounts[firstName] || 0) + 1;

        // 80% chance to add second name
        if (Math.random() < 0.8) {
            // Split into common and non-common names
            const unusedNonCommon = secondParts.filter(name => 
                !commonNames.includes(name) && !usedSecondNames.has(name)
            );
            
            // Combine available names with extra weight for common names
            const selectionPool = [...unusedNonCommon, ...commonNames, ...commonNames];
            
            // If we have any names available
            if (selectionPool.length > 0) {
                // Pick random second name
                const secondName = selectionPool[Math.floor(Math.random() * selectionPool.length)];
                
                // If it's not a common name, mark it as used
                if (!commonNames.includes(secondName)) {
                    usedSecondNames.add(secondName);
                }
                
                return `${firstName} ${secondName}`;
            }
        }
        
        return firstName;
    }

    function playerName() {
        const name = prompt("Please enter a name for your team:")
        if (name !== null){
            return name
        }
        return ''
    }

    function assignDraftOrder(){
        if (numberPool.length === 0){
            return null
        }
        
        const randomIndex = Math.floor(Math.random() * numberPool.length)
        return numberPool.splice(randomIndex, 1)[0]
    }


    function createTeams(){
        // Reset the tracking sets
        Object.keys(firstNameCounts).forEach(key => delete firstNameCounts[key]);
        usedSecondNames.clear();
        
        for(let i = 1; i <= 13; i++){
            teams[`team${i}`].name = generateClubName();
            teams[`team${i}`].draftOrder = assignDraftOrder();
            console.log(teams[`team${i}`].name);
        }
        playerTeam.draftOrder = assignDraftOrder();
        console.log(teams)
        console.log(playerTeam.draftOrder)
        gate1 = true
        playerTeam.name = playerName()
    }

    function calculateTransferValue(player, statistics) {
        let baseValue = 2.0;
        
        const stats = statistics;
        if (!stats) return baseValue;

        const minutes = stats.games?.minutes || 0;
        const gamesPlayed90 = minutes / 90;
        if (gamesPlayed90 < 1) return 0.1;

        const isDefender = stats.games?.position === 'Defender';

        // Stronger minutes-based scaling
        const minutesScaling = Math.min(1.5, Math.max(0.3, minutes / 2000));
        
        // Age factor (reduced impact)
        const ageFactor = Math.max(0.8, 1 - (Math.abs(player.age - 26) * 0.025));

        // Game time value with increased defender bonus for consistency
        const appearanceRatio = (stats.games?.appearences || 0) / 38;
        const minutesRatio = minutes / 3420;
        const consistencyBonus = isDefender ? 
            (appearanceRatio * 1.2 + minutesRatio * 1.2) : 
            (appearanceRatio * 1.0 + minutesRatio * 1.0);
        
        const appearanceBonus = Math.min(1.0, (stats.games?.appearences || 0) * 0.04);
        const minutesValue = (stats.games?.minutes || 0) * 0.0004;

        // Rating impact
        const rating = Number(stats.games?.rating || 6.6);
        const ratingDiff = rating - 6.6;
        const ratingMultiplier = isDefender ? 
            (ratingDiff > 0 ? 1 + (ratingDiff * 0.5) : 1 + (ratingDiff * 0.6)) :
            (ratingDiff > 0 ? 1 + (ratingDiff * 0.4) : 1 + (ratingDiff * 0.5));

        // Goal and assist values with efficiency bonus
        const goalsValue = ((stats.goals?.total || 0) / gamesPlayed90) * 12.0;
        const assistsValue = ((stats.goals?.assists || 0) / gamesPlayed90) * 1.5;
        
        // New efficiency bonus based on goals+assists per appearance
        const appearances = stats.games?.appearences || 0;
        const totalGoals = stats.goals?.total || 0;
        const totalAssists = stats.goals?.assists || 0;
        const goalsAndAssists = totalGoals + totalAssists;
        const efficiencyRatio = appearances > 0 ? goalsAndAssists / appearances : 0;
        
        // Exponential bonus for high efficiency (kicks in strongly above 0.5 G+A per game)
        const efficiencyBonus = efficiencyRatio > 0.5 ? 
            Math.pow(efficiencyRatio - 0.5, 2) * 10.0 : 0;
        const shotAccuracy = (stats.shots?.on || 0) / (stats.shots?.total || 1) * 1.0;
        
        // Multi-tiered passing accuracy system
        const passAccuracy = typeof stats.passes?.accuracy === 'number' ? stats.passes.accuracy : 55;
        let passAccuracyModifier;
        if (passAccuracy <= 45) {
            passAccuracyModifier = (passAccuracy - 50) * 0.2;
        } else if (passAccuracy < 50) {
            passAccuracyModifier = (passAccuracy - 50) * 0.1;
        } else if (passAccuracy >= 80) {
            passAccuracyModifier = (passAccuracy - 65) * 0.15;
        } else if (passAccuracy >= 75) {
            passAccuracyModifier = (passAccuracy - 65) * 0.1;
        } else if (passAccuracy > 65) {
            passAccuracyModifier = (passAccuracy - 65) * 0.05;
        } else {
            passAccuracyModifier = 0;
        }
        
        const passAccuracyBonus = isDefender ? 
            passAccuracyModifier * 2 : 
            passAccuracyModifier;
            
        const passValue = ((stats.passes?.total || 0) / gamesPlayed90) * 0.002;
        
        // Increased key passes value
        const keyPassesP90 = ((stats.passes?.key || 0) / gamesPlayed90);
        const keyPassValue = keyPassesP90 * 0.8; // Doubled from 0.4
        // Additional bonus for high volume of key passes
        const keyPassBonus = stats.passes?.key > 50 ? (stats.passes.key - 50) * 0.1 : 0;
        
        // Defensive contributions
        const defenderMultiplier = isDefender ? 3.0 : 1.0;
        const tackleValue = ((stats.tackles?.total || 0) / gamesPlayed90) * 0.3 * defenderMultiplier;
        const interceptValue = ((stats.tackles?.interceptions || 0) / gamesPlayed90) * 0.3 * defenderMultiplier;
        const blockValue = ((stats.tackles?.blocks || 0) / gamesPlayed90) * 0.2 * defenderMultiplier;
        
        // Goalkeeper specific
        const savesValue = ((stats.goals?.saves || 0) / gamesPlayed90) * 0.15;
        const cleanSheetBonus = (stats.goals?.conceded === 0 ? 1.5 : 0);
        
        // Duel success with defender bonus
        const duelValue = stats.duels?.total ?
            ((stats.duels.won || 0) / stats.duels.total) * (isDefender ? 1.5 : 1.0) : 0;
        
        // Discipline penalty
        const disciplineMultiplier = isDefender ? 2.5 : 1.0;
        const disciplineValue = (
            ((stats.cards?.yellow || 0) / gamesPlayed90 * -0.4) +
            ((stats.cards?.red || 0) / gamesPlayed90 * -2.5)
        ) * disciplineMultiplier;

        // Sum all contributions before minutes scaling
        const rawValue = (baseValue +
            appearanceBonus +
            minutesValue +
            consistencyBonus +
            passAccuracyBonus +
            goalsValue +
            assistsValue +
            efficiencyBonus +
            shotAccuracy +
            passValue +
            keyPassValue +
            keyPassBonus +
            tackleValue +
            interceptValue +
            blockValue +
            savesValue +
            cleanSheetBonus +
            duelValue +
            disciplineValue);

        // Apply minutes scaling before other multipliers
        const scaledValue = rawValue * minutesScaling;
        const totalValue = scaledValue * ageFactor * ratingMultiplier;
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
            complete = true
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
    <div class="main-container">
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
        {#if complete}
        <div>
            {#if !gate1}
            <button 
                onclick={createTeams} 
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
            >
                Create Teams and Start Draft
            </button>
            {/if}

            {#if gate1}
                <div class="teams-grid">
                    {#each Object.entries(teams)
                        .sort(([,a],[,b])=> a.draftOrder - b.draftOrder) as [key, team]}
                        <Team team={team} />
                    {/each}
                </div>
            {/if}
        </div>
        
     
        {/if}
    </div>
{/if}

<style>
    .main-container {
        display: flex;
        justify-content: space-around;
    }
    .players-container {
        padding: 1rem;
        max-width: 800px;
        margin-left: 5rem;
    }
    .teams-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 1rem;
                padding: 1rem;
            }
</style>