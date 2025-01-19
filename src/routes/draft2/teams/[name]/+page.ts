import { teams, playerTeam, getDraftStage } from '$lib/stores.svelte';

export const load = ({ params }) => {
    console.log(`Params: ${params}`)
    

    return {
        data: params
    };
};
