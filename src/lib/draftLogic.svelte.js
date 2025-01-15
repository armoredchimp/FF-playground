export function getPositionalNeedScore(team) {
    const positions = {
        'goalkeeper': team.keepers.length,
        'defender': team.defenders.length,
        'midfielder': team.midfielders.length,
        'attacker': team.attackers.length
    };
    
    const maxCount = Math.max(...Object.values(positions));
    
    return {
        'goalkeeper': positions.goalkeeper === 0 ? 6 : 0,
        'defender': (maxCount - positions.defender) * 2,
        'midfielder': (maxCount - positions.midfielder) * 2,
        'attacker': (maxCount - positions.attacker) * 2
    };
}

export function getValueBasedScore(index) {
    if (index < 5) {
        return Math.floor(Math.random() * 3) + 8;
    } else if (index < 10) {
        return Math.floor(Math.random() * 4) + 4;
    } else {
        return Math.floor(Math.random() * 3) + 1;
    }
}

export function executePick(teamId, isPlayer, playerTeam, teams, processedPlayers, player = null, statistics = null, transferValue = null) {
    const team = teamId === 'player' ? playerTeam : teams[teamId];
    
    if (!isPlayer) {
        const sliceSize = Math.floor(Math.random() * 5) + 10;
        const affordablePlayers = processedPlayers.filter(p => p.transferValue <= team.transferBudget);
        
        if (affordablePlayers.length === 0) {
            console.log("No affordable players available");
            return false;
        }

        const positionScores = getPositionalNeedScore(team);
        const scoredPlayers = affordablePlayers.slice(0, sliceSize).map((p, index) => ({
            ...p,
            score: getValueBasedScore(index) + 
                (p.statistics?.games?.position?.toLowerCase() ? 
                    positionScores[p.statistics.games.position.toLowerCase()] || 0 : 0)
        })).sort((a, b) => b.score - a.score);

        if (scoredPlayers.length === 0) return false;
        
        player = scoredPlayers[0].player;
        statistics = scoredPlayers[0].statistics;
        transferValue = scoredPlayers[0].transferValue;
    }

    if (transferValue > team.transferBudget) {
        console.log("Insufficient funds");
        return false;
    }

    const position = statistics?.games?.position?.toLowerCase();
    if (!position) return false;

    switch(position) {
        case 'goalkeeper': team.keepers.push(player); break;
        case 'defender': team.defenders.push(player); break;
        case 'midfielder': team.midfielders.push(player); break;
        case 'attacker':
        case 'forward': team.attackers.push(player); break;
        default: return false;
    }

    team.transferBudget -= transferValue;
    team.playerCount++;
    return { player, processedPlayers: processedPlayers.filter(p => p.player.id !== player.id) };
}

export function advanceDraft(draft, draftOrderList, playerTeam) {
    if (draft.currentPick === 14) {
        draft.currentRound++;
        draft.currentPick = 1;
    } else {
        draft.currentPick++;
    }

    let pickIndex = (draft.currentRound - 1) * 14 + (draft.currentPick - 1);
    
    if (pickIndex >= 210) {
        draft.complete = true;
        console.log("Draft complete!");
        return;
    }

    draft.currentTeam = draftOrderList[pickIndex].id === 'player' ? 
        playerTeam.name : draftOrderList[pickIndex].name;
    
    draft.nextTeam = pickIndex + 1 < 210 ? 
        (draftOrderList[pickIndex + 1].id === 'player' ? 
            playerTeam.name : draftOrderList[pickIndex + 1].name) : 
        'None';
}

export function skipToPlayerPick(draft, draftOrderList, playerTeam, teams, processedPlayers) {
    let currentIndex = (draft.currentRound - 1) * 14 + (draft.currentPick - 1);
    let nextPlayerIndex = currentIndex;
    
    // Add bounds check
    while (nextPlayerIndex < 210 && 
           nextPlayerIndex < draftOrderList.length && 
           draftOrderList[nextPlayerIndex].id !== 'player') {
        const result = executePick(draftOrderList[nextPlayerIndex].id, false, playerTeam, teams, processedPlayers);
        if (result) {
            processedPlayers = result.processedPlayers;
        }
        nextPlayerIndex++;
    }

    // Add bounds check here too
    if (nextPlayerIndex >= draftOrderList.length || nextPlayerIndex >= 210) {
        draft.complete = true;
        console.log("Draft complete!");
        return processedPlayers;
    }

    draft.currentRound = Math.floor(nextPlayerIndex / 14) + 1;
    draft.currentPick = (nextPlayerIndex % 14) + 1;
    
    draft.currentTeam = draftOrderList[nextPlayerIndex].id === 'player' ? 
        playerTeam.name : draftOrderList[nextPlayerIndex].name;
    
    // Add bounds check for nextTeam calculation
    draft.nextTeam = nextPlayerIndex + 1 < draftOrderList.length && nextPlayerIndex + 1 < 210 ? 
        (draftOrderList[nextPlayerIndex + 1].id === 'player' ? 
            playerTeam.name : draftOrderList[nextPlayerIndex + 1].name) : 
        'None';

    return processedPlayers;
}