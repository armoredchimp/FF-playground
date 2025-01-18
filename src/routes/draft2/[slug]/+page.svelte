<script lang="ts">
    import type { PageData } from "../$types";
    import TeamPlayerList from "$lib/TeamPlayerList.svelte";


    let { team }: { team: PageData } = $props()


</script>


<TeamPlayerList team={team}/>