<script>
    import { playerTeam } from "./stores.svelte";
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
        computer = false //if it belongs to AI or human player
    } = $props();

    const selectablePlayers = () => {
        const currentPosition = statistics?.games?.position;

        let positionArray;
        switch (currentPosition.toLowerCase()) {
            case 'attacker':
            case 'forward':
                positionArray = playerTeam.attackers;
                break;
            case 'midfielder':
                positionArray = playerTeam.midfielders;
                break;
            case 'defender':
                positionArray = playerTeam.defenders;
                break;
            case 'goalkeeper':
            case 'keeper':
                positionArray = playerTeam.keepers;
                break;
            default:
                return [];
        }

        return positionArray
        .filter(playerData => playerData[0].id !== player.id)  
        .map(playerData => ({                                 
            value: playerData[0].id,
            label: playerData[0].name || `${playerData[0].firstname} ${playerData[0].lastname}`
        }));
    }
</script>

<div class="player-display">
    <div class="player-info">
        <p class="name">{player.name || `${player.firstname} ${player.lastname}`}</p>
        {#if !computer}
            <Select items={selectablePlayers()}/>
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
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 0.75rem;
        width: 200px;
        height: 150px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .player-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .name {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: #1a202c;
    }

    .player-select {
        padding: 0.25rem;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        font-size: 0.875rem;
        background-color: white;
    }

    .player-details {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .player-photo {
        width: 50px;
        height: 50px;
        border-radius: 25px;
        object-fit: cover;
    }

    .photo-placeholder {
        width: 50px;
        height: 50px;
        border-radius: 25px;
        background-color: #e2e8f0;
    }

    .position {
        font-size: 0.875rem;
        color: #4a5568;
    }
</style>