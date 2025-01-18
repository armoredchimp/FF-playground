<script>
    import axios from "axios";
    import Player4 from "$lib/Player4.svelte";
    import DraftTicker from "$lib/DraftTicker.svelte";
    import Team from "$lib/Team.svelte";
    import PlayerTeam from "$lib/PlayerTeam.svelte";
    import { teams, playerTeam, draft, getDraftStage, getPlayersState, getDraftOrderState } from "$lib/stores.svelte";
    import { 
        calculateTransferValue, 
        generateClubTraits, 
        generateClubName, 
        assignDraftOrder, 
        processPlayersData,
        organizeDraftOrder 
    } from "$lib/utils.svelte";
    import { 
        getPositionalNeedScore, 
        getValueBasedScore, 
        executePick, 
        advanceDraft, 
        skipToPlayerPick 
    } from '$lib/draftLogic.svelte';
    
    // Get state management
    const draftStage = getDraftStage();
    const playersState = getPlayersState();
    const draftOrderState = getDraftOrderState();

    // Local state for reassignment
    let draftState = $state(draft);
    
    
    // True local state
    let showDraftOrder = $state(false);
    let popupTimer;
    
    let numberPool = Array.from({length:14}, (_,i) => i+1);
    const firstNameCounts = {};
    const usedSecondNames = new Set();
    
    function showPopup() {
        clearTimeout(popupTimer);
        showDraftOrder = true;
    }
    
    function hidePopup() {
        popupTimer = setTimeout(() => {
            showDraftOrder = false;
        }, 500);
    }
    
    function keepVisible() {
        clearTimeout(popupTimer);
    }
    
    function beginDraft() {
        if (!draftState.started) {
            draftState.started = true;
            draftState.currentRound = 1;
            draftState.currentPick = 1;

            let currPick = draftOrderState.orderList[0];
            let nextPick = draftOrderState.orderList[1];

            draftState.currentTeam = currPick.id === 'player' ? playerTeam.name : currPick.name;
            draftState.nextTeam = nextPick.id === 'player' ? playerTeam.name : nextPick.name;
        }
    }
    
    function handleAIPick(teamId) {
    const result = executePick(teamId, false, playerTeam, teams, playersState.processedPlayers);
    if (result) {
        playersState.setProcessedPlayers(result.processedPlayers);
        advanceDraft(draftState, draftOrderState.orderList, playerTeam);
    }
    }

    function handlePlayerPick(player, statistics, transferValue) {
        const result = executePick('player', true, playerTeam, teams, playersState.processedPlayers, player, statistics, transferValue);
        if (result) {
            playersState.setProcessedPlayers(result.processedPlayers);
            advanceDraft(draftState, draftOrderState.orderList, playerTeam);
        }
    }
    
    function playerName() {
        const name = prompt("Please enter a name for your team:");
        if (name !== null) {
            return name;
        }
        return '';
    }
    
    function createTeams() {
        Object.keys(firstNameCounts).forEach(key => delete firstNameCounts[key]);
        usedSecondNames.clear();
        
        for(let i = 1; i <= 13; i++) {
            teams[`team${i}`].name = generateClubName(firstNameCounts, usedSecondNames);
            teams[`team${i}`].draftOrder = assignDraftOrder(numberPool);
        }
        playerTeam.draftOrder = assignDraftOrder(numberPool);
        generateClubTraits();
        draftOrderState.setOrderList(organizeDraftOrder(playerTeam, teams));
        draftStage.setGate1(true);
        playerTeam.name = playerName();
    }
    
    async function fetchAndProcessPlayers() {
        if (playersState.loading) return;
        playersState.setLoading(true);
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
            playersState.setProgress({ current: 0, total: firstResponse.data.paging.total });
            
            if (firstResponse.data.response?.length) {
                processPlayersData(firstResponse.data.response, tempContainer);
            }
    
            for (let i = 2; i <= playersState.progress.total; i++) {
                playersState.setProgress({ ...playersState.progress, current: i });
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
            
            playersState.setProcessedPlayers(tempContainer.sort((a, b) => b.transferValue - a.transferValue));
            draftStage.setComplete(true);
            draftStage.setGate0(true);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            playersState.setLoading(false);
        }
    }
    </script>
    
    {#if !draftStage.gate0}
    <button 
        onclick={fetchAndProcessPlayers} 
        disabled={playersState.loading}
    >
        {playersState.loading ? `Processing players... (${playersState.progress.current}/${playersState.progress.total})` : 'Get Premier League Players'}
    </button>
{/if}

{#if playersState.processedPlayers.length > 0}
    {#if draftStage.gate1}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="draft-main-container">
        <div class="draft-ticker-container">
            <DraftTicker ticker={draftState}/>
        </div>
            {#if !draftState.started}
                <button onclick={beginDraft} class="start-draft-btn">Start Draft</button>
            {/if}
            {#if draftState.started}
            {#if draftState.currentTeam !== playerTeam.name}
                    <div class="draft-buttons">
                        <button 
                            onclick={() => handleAIPick(draftOrderState.orderList[(draftState.currentRound - 1) * 14 + (draftState.currentPick - 1)].id)} 
                            class="advance-btn">Advance Draft
                        </button>
                        <button 
                            onclick={() => {
                                playersState.setProcessedPlayers(
                                    skipToPlayerPick(draftState, draftOrderState.orderList, playerTeam, teams, playersState.processedPlayers)
                                );
                            }} 
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
                    {#each draftOrderState.orderList as pick}
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
            <h3>Premier League Players by Transfer Value ({playersState.processedPlayers.length})</h3>
            {#each playersState.processedPlayers as {player, statistics, transferValue}}
                <Player4 
                    player={player}
                    playerStats={statistics}
                    transferValue={transferValue}
                    onDraft={()=> handlePlayerPick(player, statistics, transferValue)}
                    isDraftable={draftState.started && draftState.currentTeam === playerTeam.name}
                />
            {/each}
        </div>

        {#if draftStage.complete}
            <div class="draft-section">
                {#if !draftStage.gate1}
                    <div class="create-teams-btn">
                        <button 
                            onclick={createTeams} 
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
                        >
                            Create Teams and Prepare Draft
                        </button>
                    </div>
                {/if}

                {#if draftStage.gate1}
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
            width: 42%;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            border-right: 1px solid #e5e7eb;
        }
    
        .ai-teams-section {
            width: 58%;
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