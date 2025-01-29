<script lang="ts">
    
    import TeamPlayerList from '$lib/TeamPlayerList.svelte';
    import TeamHeader from '$lib/TeamHeader.svelte';
    import FormationDisplay from '$lib/FormationDisplay.svelte';
    import { playerTeam } from '$lib/stores.svelte';


  
    // const atks = $derived(
    //     playerTeam.selected[0].map(player => player[0].name)
    // )
</script>

<div class="page-container">
    <!-- <h4>{atks}</h4> -->
    <div><TeamHeader team={playerTeam} computer={false}/></div>
    {#if playerTeam?.playerCount >= 11}
    <div class="main-cont">
        <div class="formation">
            <FormationDisplay team={playerTeam} computer={false}/>
        </div>
        <div class="team-list">
            <TeamPlayerList team={playerTeam}/>
        </div>    
    </div>
    {:else}
        <TeamPlayerList team={playerTeam}/>
    {/if}
</div>
        

<style>
    .page-container {
        padding-bottom: 4rem;
        min-height: 100vh;
    }
    
    .main-cont {
        display: flex;
        gap: 6rem;
        justify-content: flex-start;
        padding: 0 1rem;
    }
    
    .formation {
        margin-left: 1rem;
    }
</style>