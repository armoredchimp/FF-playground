import { teams, playerTeam, getDraftStage, playersState } from '$lib/stores.svelte';

export const load = ({ params }) => {
    
    const foundTeam = Object.entries(teams).find(([_, teamData]) => teamData.name.toLowerCase() === params.name.toLowerCase())

    const players = playersState.processedPlayers
    
    return {
        team: foundTeam ? foundTeam[1] : null,
        players: players
    }
};
