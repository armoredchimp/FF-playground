<script lang="ts">
    import axios from "axios";
    import Player4 from "$lib/Player4.svelte";
    import Team from "$lib/Team.svelte";
    import PlayerTeam from "$lib/PlayerTeam.svelte";
    import { teams } from "$lib/teams.svelte";
    import { calculateTransferValue, generateClubTraits } from "$lib/utils.svelte"
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

    function assignDraftOrder() {
        if (numberPool.length === 0){
            return null;
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
        generateClubTraits();
        console.log(teams)
        console.log(playerTeam.draftOrder)
        gate1 = true
        playerTeam.name = playerName()
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
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
>
    {loading ? `Processing players... (${progress.current}/${progress.total})` : 'Get Premier League Players'}
</button>

{#if processedPlayers.length > 0}
    <div class="page-container">
        <div class="players-section">
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
            <div class="draft-section">
                {#if !gate1}
                    <div class="create-teams-btn">
                        <button 
                            onclick={createTeams} 
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
                        >
                            Create Teams and Start Draft
                        </button>
                    </div>
                {/if}

                {#if gate1}
                    <div class="player-team-section">
                        <PlayerTeam team={playerTeam} />
                    </div>
                    <div class="ai-teams-section">
                        <div class="teams-grid">
                            {#each Object.entries(teams)
                                .sort(([,a],[,b])=> a.draftOrder - b.draftOrder) as [key, team]}
                                <Team team={team} />
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
{/if}

<style>
    .page-container {
        display: flex;
        width: 100%;
        max-width: 2000px;
        margin: 0 auto;
        gap: 2rem;
        padding: 1rem;
        height: calc(100vh - 120px);
    }

    .players-section {
        width: 40%;
        padding: 1rem;
        overflow-y: auto;
        border-right: 1px solid #e5e7eb;
    }

    .draft-section {
        display: flex;
        width: 60%;
    }

    .player-team-section {
        width: 42%;  /* 25% of total width (42% of 60%) */
        padding: 1rem;
        display: flex;
        justify-content: center;
        border-right: 1px solid #e5e7eb;
    }

    .ai-teams-section {
        width: 58%;  /* 35% of total width (58% of 60%) */
        padding: 1rem;
        overflow-y: auto;
    }

    .teams-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, 300px);
        gap: 1.5rem;
        justify-content: center;
    }

    .create-teams-btn {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 1rem;
    }

    h3 {
        margin-bottom: 1rem;
        font-size: 1.2rem;
        font-weight: bold;
    }
</style>