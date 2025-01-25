<script>
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
        statistics = null
    } = $props();
</script>

<div class="player-display">
    <div class="player-info">
        <p class="name">{player.name || `${player.firstname} ${player.lastname}`}</p>
        <select class="player-select">
            <option value="">Select Player</option>
        </select>
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