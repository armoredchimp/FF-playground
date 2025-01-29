<script lang="ts">
    
    import TeamPlayerList from '$lib/TeamPlayerList.svelte';
    import TeamHeader from '$lib/TeamHeader.svelte';
    import FormationDisplay from '$lib/FormationDisplay.svelte';
    import { playerTeam, reRender } from '$lib/stores.svelte';
    
    

</script>

<div class="page-container">
    <div><TeamHeader team={playerTeam} computer={false}/></div>
    {#if playerTeam?.playerCount >= 11}
    <div class="main-cont">
        <div class="formation">
            <FormationDisplay team={playerTeam} computer={false}/>
        </div>
        {#key reRender.reRenderBool}
        <div class="team-list">
            <TeamPlayerList team={playerTeam}/>           
        </div>
        {/key}   
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