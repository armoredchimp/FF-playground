<script>
    import Table from "$lib/Table.svelte";
    import { teams, playerTeam } from "$lib/stores.svelte";
    

    
</script>

<Table teams={teams} playerTeam={playerTeam}/>