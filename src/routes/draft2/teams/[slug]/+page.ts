import { teams, playerTeam } from '$lib/stores.svelte';

export const load = ({ params }) => {
    console.log('Loading team page for:', params.slug);
    
    return {
        slug: params.slug
    };
};
