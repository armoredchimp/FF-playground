<script>
    let {
        team = {
            name: '',
            draftOrder: 0,
            attackers: [],
            midfielders: [],
            defenders: [],
            keepers: [],
            playerCount: 0
        }
    } = $props();
</script>

<div class="team-box">
    <h3>{team.name}</h3>
</div>

<style>
    .team-box {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 1rem;
        margin: 0.5rem;
        background-color: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h3 {
        margin: 0;
        font-size: 1.1rem;
        color: #333;
    }
</style>