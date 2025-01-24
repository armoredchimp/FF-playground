<script lang="ts">
    import type { PageData } from './$types';
    import TeamPlayerList from '$lib/TeamPlayerList.svelte';
    import TeamHeader from '$lib/TeamHeader.svelte';
    import FormationDisplay from '$lib/FormationDisplay.svelte';
    import { teams, playerTeam, draftStageState, getDraftStage, getPlayersState, getDraftOrderState } from '$lib/stores.svelte';

    let { data }: { data: PageData } = $props();
    function test(){
        console.log(data)
        // console.log(data.name)
    }
</script>

<div class="page-container">
    <div><TeamHeader team={data.team} /></div>

    <div class="main-cont">
        <div class="formation">
            <FormationDisplay team={data.team} />
        </div>
        <div class="team-list">
            <TeamPlayerList team={data.team}/>
        </div>    
    </div>
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