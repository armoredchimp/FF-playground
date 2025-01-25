<script lang="ts">
    import type { PageData } from './$types';
    import TeamPlayerList from '$lib/TeamPlayerList.svelte';
    import TeamHeader from '$lib/TeamHeader.svelte';
    import FormationDisplay from '$lib/FormationDisplay.svelte';
    import { teams, playerTeam, draftStageState, getDraftStage, getPlayersState, getDraftOrderState } from '$lib/stores.svelte';

    let { data }: { data: PageData } = $props();
    
</script>

<div class="page-container">
    <div><TeamHeader team={data.team} computer={true}/></div>
    {#if data.team?.playerCount >= 11}
    <div class="main-cont">
        <div class="formation">
            <FormationDisplay team={data.team} />
        </div>
        <div class="team-list">
            <TeamPlayerList team={data.team}/>
        </div>    
    </div>
    {:else}
        <TeamPlayerList team={data.team}/>
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