<script lang="ts">
    import axios from "axios";
    import Player4 from "$lib/Player4.svelte";
    import DraftTicker from "$lib/DraftTicker.svelte";
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
        playerCount: 0,
        transferBudget: 350
    })

    let draft = $state({
        started: false,
        complete: false,
        currentRound: 1,
        currentPick: 1,
        currentTeam: '',
        nextTeam: ''

    })

    let processedPlayers = $state([]); 
    let loading = $state(false);
    let progress = $state({ current: 0, total: 0 });
    let complete = $state(false);
    let gate0 = $state(false);
    let gate1 = $state(false);
    let draftOrderList = $state([]);
    let showDraftOrder = $state(false)
    let popupTimer;

    let numberPool = Array.from({length:14}, (_,i) => i+1);
    
    const firstNameCounts = {};
    const usedSecondNames = new Set();

    function showPopup(){
        clearTimeout(popupTimer);
        showDraftOrder = true;
    }

    function hidePopup(){
        popupTimer = setTimeout(()=>{
            showDraftOrder = false;
       }, 500)
    }

    function keepVisible(){
        clearTimeout(popupTimer)
    }

    function organizeDraftOrder() {
        // Get all teams including player team
        const allTeams = [
            { id: 'player', ...playerTeam },
            ...Object.entries(teams).map(([key, team]) => ({ id: key, ...team }))
        ];

        // Sort by draft order
        allTeams.sort((a, b) => a.draftOrder - b.draftOrder);

        // Create snake draft order for 15 rounds (typical squad size)
        const fullDraftOrder = [];
        for (let round = 0; round < 15; round++) {
            if (round % 2 === 0) {
                // Forward order
                fullDraftOrder.push(...allTeams.map(team => ({
                    ...team,
                    round: round + 1,
                    pick: round % 2 === 0 ? allTeams.indexOf(team) + 1 : allTeams.length - allTeams.indexOf(team)
                })));
            } else {
                // Reverse order
                fullDraftOrder.push(...[...allTeams].reverse().map(team => ({
                    ...team,
                    round: round + 1,
                    pick: round % 2 === 0 ? allTeams.indexOf(team) + 1 : allTeams.length - allTeams.indexOf(team)
                })));
            }
        }

        draftOrderList = fullDraftOrder;
        console.log("Full draft order:", draftOrderList);
        return draftOrderList;
    }


    function beginDraft() {
        if (!draft.started) {
            draft.started = true;
            draft.currentRound = 1;
            draft.currentPick = 1;

            let currPick = draftOrderList[0];
            let nextPick = draftOrderList[1];

            draft.currentTeam = currPick.id === 'player' ? playerTeam.name : currPick.name;
            draft.nextTeam = nextPick.id === 'player' ? playerTeam.name : nextPick.name;
        }
    }

    function getPositionalNeedScore(team) {
        const positions = {
            'goalkeeper': team.keepers.length,
            'defender': team.defenders.length,
            'midfielder': team.midfielders.length,
            'attacker': team.attackers.length
        };
        
        // Find the most filled position
        const maxCount = Math.max(...Object.values(positions));
        
        // Calculate scores based on difference from most filled position
        return {
            'goalkeeper': positions.goalkeeper === 0 ? 6 : 0,  // Must get a keeper
            'defender': (maxCount - positions.defender) * 2,
            'midfielder': (maxCount - positions.midfielder) * 2,
            'attacker': (maxCount - positions.attacker) * 2
        };
    }

    function getValueBasedScore(index) {
        if (index < 5) {
            return Math.floor(Math.random() * 3) + 8;  // 8-10
        } else if (index < 10) {
            return Math.floor(Math.random() * 4) + 4;  // 4-7
        } else {
            return Math.floor(Math.random() * 3) + 1;  // 1-3
        }
    }

    function skipToPlayerPick() {
        let currentIndex = (draft.currentRound - 1) * 14 + (draft.currentPick - 1);
        let nextPlayerIndex = currentIndex;
        
        while (nextPlayerIndex < 210 && 
            draftOrderList[nextPlayerIndex].id !== 'player') {
            executePick(draftOrderList[nextPlayerIndex].id, false);
            nextPlayerIndex++;
        }

        // Update draft state to the player's turn
        draft.currentRound = Math.floor(nextPlayerIndex / 14) + 1;
        draft.currentPick = (nextPlayerIndex % 14) + 1;
        
        draft.currentTeam = draftOrderList[nextPlayerIndex].id === 'player' ? 
            playerTeam.name : draftOrderList[nextPlayerIndex].name;
        
        draft.nextTeam = nextPlayerIndex + 1 < 210 ? 
            (draftOrderList[nextPlayerIndex + 1].id === 'player' ? 
                playerTeam.name : draftOrderList[nextPlayerIndex + 1].name) : 
            'None';
    }

    function executePick(teamId, isPlayer, player = null, statistics = null, transferValue = null) {
        const team = teamId === 'player' ? playerTeam : teams[teamId];
        
        // For AI picks
        if (!isPlayer) {
            const sliceSize = Math.floor(Math.random() * 5) + 10;
            const affordablePlayers = processedPlayers.filter(p => p.transferValue <= team.transferBudget);
            
            if (affordablePlayers.length === 0) {
                console.log("No affordable players available");
                advanceDraft();
                return;
            }

            const positionScores = getPositionalNeedScore(team);
            const scoredPlayers = affordablePlayers.slice(0, sliceSize).map((p, index) => ({
                ...p,
                score: getValueBasedScore(index) + 
                    (p.statistics?.games?.position?.toLowerCase() ? 
                        positionScores[p.statistics.games.position.toLowerCase()] || 0 : 0)
            })).sort((a, b) => b.score - a.score);

            if (scoredPlayers.length === 0) return;
            
            player = scoredPlayers[0].player;
            statistics = scoredPlayers[0].statistics;
            transferValue = scoredPlayers[0].transferValue;
        }

        // For both AI and player picks
        if (transferValue > team.transferBudget) {
            console.log("Insufficient funds");
            return false;
        }

        const position = statistics?.games?.position?.toLowerCase();
        if (!position) return false;

        // Update team
        switch(position) {
            case 'goalkeeper': team.keepers.push(player); break;
            case 'defender': team.defenders.push(player); break;
            case 'midfielder': team.midfielders.push(player); break;
            case 'attacker':
            case 'forward': team.attackers.push(player); break;
            default: return false;
        }

        team.transferBudget -= transferValue;
        team.playerCount++;
        processedPlayers = processedPlayers.filter(p => p.player.id !== player.id);
        return true;
    }

    function handleAIPick(teamId) {
        if (executePick(teamId, false)) {
            advanceDraft();
        }
    }

    function advanceDraft() {
        // If this is a newly completed pick, advance to next pick
        if (draft.currentPick === 14) {
            draft.currentRound++;
            draft.currentPick = 1;
        } else {
            draft.currentPick++;
        }

        let pickIndex = (draft.currentRound - 1) * 14 + (draft.currentPick - 1);
        
        if (pickIndex >= 210) {
            draft.complete = true;
            console.log("Draft complete!");
            return;
        }

        // Update current and next teams based on the new pick index
        draft.currentTeam = draftOrderList[pickIndex].id === 'player' ? 
            playerTeam.name : draftOrderList[pickIndex].name;
        
        draft.nextTeam = pickIndex + 1 < 210 ? 
            (draftOrderList[pickIndex + 1].id === 'player' ? 
                playerTeam.name : draftOrderList[pickIndex + 1].name) : 
            'None';
        }

    function handlePlayerPick(player, statistics, transferValue) {
        if (executePick('player', true, player, statistics, transferValue)) {
            advanceDraft();
        }
    }
    function generateClubName() {
        const availableFirsts = firstParts.filter(name => 
            !firstNameCounts[name] || firstNameCounts[name] < 2
        );
        
        const firstName = availableFirsts[Math.floor(Math.random() * availableFirsts.length)];
        firstNameCounts[firstName] = (firstNameCounts[firstName] || 0) + 1;

        if (Math.random() < 0.8) {
            const unusedNonCommon = secondParts.filter(name => 
                !commonNames.includes(name) && !usedSecondNames.has(name)
            );
            
            const selectionPool = [...unusedNonCommon, ...commonNames, ...commonNames];
            
            if (selectionPool.length > 0) {
                const secondName = selectionPool[Math.floor(Math.random() * selectionPool.length)];
                
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
        Object.keys(firstNameCounts).forEach(key => delete firstNameCounts[key]);
        usedSecondNames.clear();
        
        for(let i = 1; i <= 13; i++){
            teams[`team${i}`].name = generateClubName();
            teams[`team${i}`].draftOrder = assignDraftOrder();
            console.log(teams[`team${i}`].name);
        }
        playerTeam.draftOrder = assignDraftOrder();
        generateClubTraits();
        organizeDraftOrder();
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
            gate0 = true
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

{#if !gate0}
    <button 
        onclick={fetchAndProcessPlayers} 
        disabled={loading}
    >
        {loading ? `Processing players... (${progress.current}/${progress.total})` : 'Get Premier League Players'}
    </button>
{/if}

{#if processedPlayers.length > 0}
    {#if gate1}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="draft-main-container">
        <div class="draft-ticker-container">
            <DraftTicker  ticker={draft}/>
        </div>
            {#if !draft.started}
                <button onclick={beginDraft} class="start-draft-btn">Start Draft</button>
            {/if}
            {#if draft.started}
            {#if draft.currentTeam !== playerTeam.name}
                <div class="draft-buttons">
                    <button 
                        onclick={() => handleAIPick(draftOrderList[(draft.currentRound - 1) * 14 + (draft.currentPick - 1)].id)} 
                        class="advance-btn">Advance Draft
                    </button>
                    <button 
                        onclick={skipToPlayerPick} 
                        class="skip-btn">Skip to Next Player Pick
                    </button>
                </div>
            {/if}
        {/if}
        <div 
        class="draft-order-container"
        onmouseenter={showPopup}
        onmouseleave={hidePopup}
    >
        <span class="draft-order-trigger">View Draft Order</span>
        <div 
            class="draft-order-popup"
            class:visible={showDraftOrder}
            onmouseenter={keepVisible}
            onmouseleave={hidePopup}
        >
            <div class="popup-content">
                <h4>Draft Order</h4>
                <div class="draft-list">
                    {#each draftOrderList as pick}
                        <div class="draft-pick">
                            Round {pick.round}, Pick {pick.pick}: {pick.id === 'player' ? playerTeam.name : pick.name}
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>
    {/if}
    
    <div class="page-container">
        <div class="players-section">
            <h3>Premier League Players by Transfer Value ({processedPlayers.length})</h3>
            {#each processedPlayers as {player, statistics, transferValue}}
                <Player4 
                    player={player}
                    playerStats={statistics}
                    transferValue={transferValue}
                    onDraft={()=> handlePlayerPick(player, statistics, transferValue)}
                    isDraftable={draft.started && draft.currentTeam === playerTeam.name}
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
                            Create Teams and Prepare Draft
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
    button {
        background-color: #3b82f6;
        color: #ffffff;             
        font-weight: 700;           
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;     
        margin-bottom: 1.5rem;      
    }

    button:hover {
        background-color: #1d4ed8;  /* hover:bg-blue-700 */
    }


    .page-container {
        display: flex;
        width: 100%;
        max-width: 2000px;
        margin: 0 auto;
        gap: 2rem;
        padding: 1rem;
        height: calc(100vh - 180px); /* Adjusted for draft order text */
    }
    
    .draft-main-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        max-width: 2000px;
        margin: 0 auto 1rem auto;
        padding: 0 2rem;
    }

    .draft-ticker-container {
        flex: 1;
        display: flex;
        justify-content: flex-start;
    }

    .draft-order-container {
        position: relative;
        margin-left: 2rem;
    }

    .draft-order-trigger {
        color: #4a5568;
        text-decoration: underline;
        cursor: pointer;
        font-size: 1.1rem;
        padding: 0.5rem 1rem;
        /* margin-right: 10rem; */
    }
    
    .draft-order-popup {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        z-index: 50;
        min-width: 400px;
        max-width: 600px;
    }
    
    .draft-buttons {
        display: flex;
        gap: 1rem;
        margin-right: 15rem;
    }

    .skip-btn {
        background-color: #4b5563;
    }

    .skip-btn:hover {
        background-color: #374151;
    }


    .draft-order-popup.visible {
        display: block;
    }
    .popup-content {
        max-height: 70vh;
        overflow-y: auto;
    }

    .draft-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .draft-pick {
        padding: 0.75rem;
        background: #f8fafc;
        border-radius: 4px;
        font-size: 1rem;
    }

    .draft-pick:nth-child(even) {
        background: #f1f5f9;
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
        flex-direction: column;
        align-items: center;
        gap: 1rem;
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

    h4 {
        margin-bottom: 1rem;
        font-size: 1.3rem;
        font-weight: bold;
        text-align: center;
        color: #1a202c;
    }
</style>