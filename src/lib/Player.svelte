<script>
    let {player = {
        id: 0,
        name: '',
        age: 0,
        number: 0,
        position: '',
    } } = $props()
</script>


<div class="player-card">
    {#if player.number}
        <div class="number">#{player.number}</div>
    {/if}
    <div class="info">
        <h3>{player.name}</h3>
        <p>{player.position} • Age: {player.age}</p>
    </div>
</div>

<style>
    .player-card {
        border: 1px solid #ddd;
        padding: 1rem;
        margin: 0.5rem 0;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .number {
        font-size: 1.5rem;
        font-weight: bold;
        color: #666;
    }

    .info h3 {
        margin: 0;
        font-size: 1.1rem;
    }

    .info p {
        margin: 0.2rem 0 0 0;
        color: #666;
    }
</style>