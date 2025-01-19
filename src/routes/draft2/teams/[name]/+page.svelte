<script lang="ts">
    import type { PageData } from './$types';
    import TeamPlayerList from '$lib/TeamPlayerList.svelte';
    import { teams, playerTeam, draftStageState, getDraftStage, getPlayersState, getDraftOrderState } from '$lib/stores.svelte';

    let { data }: { data: PageData } = $props();
    function test(){
        console.log(data)
        // console.log(data.name)
    }
 
    const draftStage = getDraftStage();
    const playersState = getPlayersState();
    const draftOrderState = getDraftOrderState();
</script>



<TeamPlayerList team={data.team}/>