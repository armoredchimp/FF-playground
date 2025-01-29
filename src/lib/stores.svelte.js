export let teams = $state({
    team1: {
        name: '',
        draftOrder: 0,
        attackers: [],
        midfielders: [],
        defenders: [],
        keepers: [],
        selected: [],
        playerCount: 0,
        traits: [],
        transferBudget: 275.00,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        formation: '4-4-2',
        formationDisplayed: false
    },
    team2: {
        name: '',
        draftOrder: 0,
        attackers: [],
        midfielders: [],
        defenders: [],
        keepers: [],
        selected: [],
        playerCount: 0,
        traits: [],
        transferBudget: 275.00,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        formation: '4-4-2',
        formationDisplayed: false
    },
    team3: {
        name: '',
        draftOrder: 0,
        attackers: [],
        midfielders: [],
        defenders: [],
        keepers: [],
        selected: [],
        playerCount: 0,
        traits: [],
        transferBudget: 275.00,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        formation: '4-4-2',
        formationDisplayed: false
    },
    team4: {
        name: '',
        draftOrder: 0,
        attackers: [],
        midfielders: [],
        defenders: [],
        keepers: [],
        selected: [],
        playerCount: 0,
        traits: [],
        transferBudget: 275.00,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        formation: '4-4-2',
        formationDisplayed: false
    },
    team5: {
        name: '',
        draftOrder: 0,
        attackers: [],
        midfielders: [],
        defenders: [],
        keepers: [],
        selected: [],
        playerCount: 0,
        traits: [],
        transferBudget: 275.00,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        formation: '4-4-2',
        formationDisplayed: false
    },
    team6: {
        name: '',
        draftOrder: 0,
        attackers: [],
        midfielders: [],
        defenders: [],
        keepers: [],
        selected: [],
        playerCount: 0,
        traits: [],
        transferBudget: 275.00,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        formation: '4-4-2',
        formationDisplayed: false
    },
    team7: {
        name: '',
        draftOrder: 0,
        attackers: [],
        midfielders: [],
        defenders: [],
        keepers: [],
        selected: [],
        playerCount: 0,
        traits: [],
        transferBudget: 275.00,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        formation: '4-4-2',
        formationDisplayed: false
    },
    team8: {
        name: '',
        draftOrder: 0,
        attackers: [],
        midfielders: [],
        defenders: [],
        keepers: [],
        selected: [],
        playerCount: 0,
        traits: [],
        transferBudget: 275.00,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        formation: '4-4-2',
        formationDisplayed: false
    },
    team9: {
        name: '',
        draftOrder: 0,
        attackers: [],
        midfielders: [],
        defenders: [],
        keepers: [],
        selected: [],
        playerCount: 0,
        traits: [],
        transferBudget: 275.00,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        formation: '4-4-2',
        formationDisplayed: false
    },
    team10: {
        name: '',
        draftOrder: 0,
        attackers: [],
        midfielders: [],
        defenders: [],
        keepers: [],
        selected: [],
        playerCount: 0,
        traits: [],
        transferBudget: 275.00,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        formation: '4-4-2',
        formationDisplayed: false
    },
    team11: {
        name: '',
        draftOrder: 0,
        attackers: [],
        midfielders: [],
        defenders: [],
        keepers: [],
        selected: [],
        playerCount: 0,
        traits: [],
        transferBudget: 275.00,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        formation: '4-4-2',
        formationDisplayed: false
    },
    team12: {
        name: '',
        draftOrder: 0,
        attackers: [],
        midfielders: [],
        defenders: [],
        keepers: [],
        selected: [],
        playerCount: 0,
        traits: [],
        transferBudget: 275.00,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        formation: '4-4-2',
        formationDisplayed: false
    },
    team13: {
        name: '',
        draftOrder: 0,
        attackers: [],
        midfielders: [],
        defenders: [],
        keepers: [],
        selected: [],
        playerCount: 0,
        traits: [],
        transferBudget: 275.00,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        formation: '4-4-2',
        formationDisplayed: false
    }
});

export let playerTeam = $state({
    name: '',
    draftOrder: 0,
    attackers: [],
    midfielders: [],
    defenders: [],
    keepers: [],
    selected: [],
    playerCount: 0,
    transferBudget: 275,
    wins: 0,
    draws: 0,
    losses: 0,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    formation: '4-4-2',
    formationDisplayed: false,
    player: true
});



export let draftStageState = $state({
    complete: false,
    gate0: false,
    gate1: false
});

export let draftOrderState = $state({
    orderList: []
})

export let draft = $state({
    started: false,
    complete: false,
    currentRound: 1,
    currentPick: 1,
    currentTeam: '',
    nextTeam: ''
});

export let playersState = $state({
    processedPlayers: [],
    loading: false,
    progress: { current: 0, total: 0 }
});

export let reRender = $state({
    reRenderBool: false
})

export function reRendering(){
    return {
        get reRenderBool() { return reRender.reRenderBool },
        setRender(value) { reRender.reRenderBool = value}
    }
}

export let processedPlayers = $state([]);
export let draftOrderList = $state([]);
export let loading = $state(false);
export let progress = $state({ 
    current: 0, 
    total: 0 
});



export function getDraftStage() {
    return {
        get complete() { return draftStageState.complete; },
        get gate0() { return draftStageState.gate0; },
        get gate1() { return draftStageState.gate1; },
        setComplete(value) { draftStageState.complete = value; },
        setGate0(value) { draftStageState.gate0 = value; },
        setGate1(value) { draftStageState.gate1 = value; }
    };
}

export function getDraftOrderState(){
    return {
        get orderList(){
            return draftOrderState.orderList;
        },
        setOrderList(list){
            draftOrderState.orderList = list;
        }
    }
}

export function getPlayersState() {
    return {
        get processedPlayers() { return playersState.processedPlayers; },
        get loading() { return playersState.loading; },
        get progress() { return playersState.progress; },
        setProcessedPlayers(players) { playersState.processedPlayers = players; },
        setLoading(value) { playersState.loading = value; },
        setProgress(value) { playersState.progress = value; }
    };
}

