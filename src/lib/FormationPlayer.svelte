<script>
    import { playerTeam, reRendering } from "./stores.svelte";
    import Select from "svelte-select";

    let {
        player = {
            id: 0,
            name: '',
            age: 0,
            firstname: '',
            lastname: '',
            nationality: '',
            photo: ''
        },
        statistics = null,
        computer = false
    } = $props();

   
    let positionArray = [];
    let currPositionArray = 0;
    const reRenderState = reRendering()
  

    const positionMap = {
        attacker: { array: playerTeam.attackers, index: 0 },
        midfielder: { array: playerTeam.midfielders, index: 1 },
        defender: { array: playerTeam.defenders, index: 2 },
        goalkeeper: { array: playerTeam.keepers, index: 3 },
    };

    const selectablePlayers = () => {
        const currentPosition = statistics?.games?.position?.toLowerCase();
        const { array, index } = positionMap[currentPosition] || { array: [], index: 0 };
        positionArray = array;
        currPositionArray = index;

        const allSelectedPlayers = playerTeam.selected.flat();
        const selectedIds = new Set(allSelectedPlayers.map(p => p[0].id));

        return positionArray
            .filter(([p]) => p.id !== player.id && !selectedIds.has(p.id))
            .map(([p]) => ({
                value: p.id,
                label: p.name || `${p.firstname} ${p.lastname}`
            }));
    };

    const onChange = (e) => {
        console.log(playerTeam)
        let selectedPlayerName = e.detail.label;
        const currPos = playerTeam.selected[currPositionArray];

        const newPlayer = currPos.find(([p]) => p.name === selectedPlayerName) ||
                          positionArray.find(([p]) => p.name === selectedPlayerName);

        if (!newPlayer) return;

        const oldPlayerIndex = currPos.findIndex(([p]) => p.id === player.id);
        if (oldPlayerIndex !== -1) currPos.splice(oldPlayerIndex, 1);

        currPos.push(newPlayer);
        player = { ...newPlayer[0] };
        statistics = newPlayer[1];
        e.detail.label = ''
        const renderCurrent = reRenderState.reRenderBool
        reRenderState.setRender(!renderCurrent)

        // console.log('oldPlayer: ', player, statistics);
        // console.log('newPlayer: ', newPlayer[0], newPlayer[1]);
        // console.log('currPos: ', currPos);
    };
//     export function reRendering(){
//     return {
//         get reRenderBool() { return reRender.reRenderBool },
//         setRender(value) { reRender.reRenderBool = value}
//     }
// }
</script>

<div class="player-display">
    <div class="player-info">
        <p class="name">{player.name || `${player.firstname} ${player.lastname}`}</p>
        {#if !computer}
            <Select items={selectablePlayers()} on:change={onChange} class="player-select" />
        {/if}
    </div>
    <div class="player-details">
        {#if player.photo}
            <img src={player.photo} alt={player.lastname} class="player-photo" />
        {:else}
            <div class="photo-placeholder"></div>
        {/if}
        <span class="position">{statistics?.games?.position || 'N/A'}</span>
    </div>
</div>

<style>
    .player-display {
        background: linear-gradient(135deg, #ffffff, #f9fafb);
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1rem;
        width: 220px;
        height: 180px;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .player-display:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    .player-info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .name {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 700;
        color: #1a202c;
    }

    .player-select {
        width: 100%;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        font-size: 0.875rem;
        background-color: white;
        padding: 0.5rem;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .player-select:hover {
        border-color: #a0aec0;
        box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
    }

    .player-details {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: auto;
    }

    .player-photo {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .player-photo:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .photo-placeholder {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.875rem;
        color: #718096;
    }

    .position {
        font-size: 0.875rem;
        font-weight: 600;
        color: #4a5568;
        background: #edf2f7;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
    }
</style>