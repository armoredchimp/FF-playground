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


<h1>{data}</h1>
<h2>{draftStage.gate0}</h2>
<!-- svelte-ignore a11y_consider_explicit_label -->
 <h2>{data.team}</h2>
<button onclick={test}>Click here</button>
<TeamPlayerList team={data.team}/>