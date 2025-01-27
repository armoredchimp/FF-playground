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
        computer = false, // if it belongs to AI or human player
        selected = true
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
            <Select items={selectablePlayers()} class="player-select" />
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
        background: linear-gradient(135deg, #ffffff, #f9fafb); /* Gradient background */
        border: 1px solid #e2e8f0;
        border-radius: 12px; /* Rounded corners */
        padding: 1rem;
        width: 220px; /* Slightly wider for better spacing */
        height: 180px; /* Increased height to fit everything */
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Subtle shadow */
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .player-display:hover {
        transform: translateY(-2px); /* Slight lift on hover */
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15); /* Enhanced shadow on hover */
    }

    .player-info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .name {
        margin: 0;
        font-size: 1.1rem; /* Slightly larger */
        font-weight: 700; /* Bolder */
        color: #1a202c; /* Darker text for contrast */
    }

    .player-select {
        width: 100%;
        border: 1px solid #e2e8f0;
        border-radius: 6px; /* Rounded corners */
        font-size: 0.875rem;
        background-color: white;
        padding: 0.5rem;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .player-select:hover {
        border-color: #a0aec0; /* Highlight border on hover */
        box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2); /* Focus effect */
    }

    .player-details {
        display: flex;
        align-items: center;
        gap: 1rem; /* Increased gap for better spacing */
        margin-top: auto; /* Push details to the bottom */
    }

    .player-photo {
        width: 60px; /* Slightly larger */
        height: 60px;
        border-radius: 50%; /* Perfect circle */
        object-fit: cover;
        border: 2px solid #ffffff; /* White border */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .player-photo:hover {
        transform: scale(1.05); /* Slight zoom on hover */
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* Enhanced shadow on hover */
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
        font-weight: 600; /* Bolder */
        color: #4a5568;
        background: #edf2f7; /* Light background */
        padding: 0.25rem 0.5rem;
        border-radius: 4px; /* Rounded corners */
    }
</style>