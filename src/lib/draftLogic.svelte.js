// Helper functions
const getPosition = (player) => player.statistics?.games?.position?.toLowerCase() || '';
const getStatPerGame = (stat, appearances) => (stat || 0) / (appearances || 1);
const getTraitEffects = (traits = []) => ({
    defensive: traits.includes('Favors Defense'),
    attacking: traits.includes('Favors Attacking'),
    passing: traits.includes('Strong Passing'),
    pressure: traits.includes('High Pressure'),
    wingPlay: traits.includes('Wing Play'),
    starPower: traits.includes('Star Powered'),
    aggressive: traits.includes('Aggressive Tackling'),
    youth: traits.includes('Youth Focus'),
    experience: traits.includes('Favors Experience'),
    teamwork: traits.includes('Teamwork Focus'),
    setPiece: traits.includes('Set Piece Specialists')
});

export function getPositionalNeedScore(team, traits = []) {
    const positions = {
        'goalkeeper': team.keepers.length,
        'defender': team.defenders.length,
        'midfielder': team.midfielders.length,
        'attacker': team.attackers.length
    };
    
    // Base position targets
    const positionTargets = {
        'goalkeeper': 2,
        'defender': getTraitEffects(traits).defensive ? 5 : 4,
        'midfielder': 4,
        'attacker': getTraitEffects(traits).attacking ? 4 : 3
    };
    
     // Check if all positions have met their targets
     const allTargetsMet = Object.entries(positionTargets).every(([pos, target]) => 
        positions[pos] >= target
    );
    
    // If all targets are met, allow exceeding positions freely
    if (allTargetsMet) {
        return {
            'goalkeeper': 1,
            'defender': 1,
            'midfielder': 1,
            'attacker': 1
        };
    }
    return {
        'goalkeeper': positions.goalkeeper >= positionTargets.goalkeeper ? -10 :
            positions.goalkeeper === 0 ? 8 : 
            positions.goalkeeper === 1 ? 2 : 0,
        'defender': positions.defender >= positionTargets.defender ? -10 :
            getTraitEffects(traits).defensive ? 
                (positionTargets.defender - positions.defender) * 3 : 
                (positionTargets.defender - positions.defender) * 2,
        'midfielder': positions.midfielder >= positionTargets.midfielder ? -10 :
            (positionTargets.midfielder - positions.midfielder) * 2,
        'attacker': positions.attacker >= positionTargets.attacker ? -10 :
            getTraitEffects(traits).attacking ?
                (positionTargets.attacker - positions.attacker) * 3 :
                (positionTargets.attacker - positions.attacker) * 2
    };
}

export function getValueBasedScore(index, player, traits = []) {
    const position = getPosition(player);
    const appearances = player.statistics?.games?.appearences || 1;
    let score = 0;
    
    // Base value score adjusted for star power
    score += index < 5 ? 
        Math.floor(Math.random() * 3) + (getTraitEffects(traits).starPower ? 12 : 8) :
        index < 10 ?
            Math.floor(Math.random() * 4) + (getTraitEffects(traits).starPower ? 7 : 4) :
            Math.floor(Math.random() * 3) + (getTraitEffects(traits).starPower ? 3 : 1);

    // Defensive trait scoring
    if (getTraitEffects(traits).defensive && player.statistics?.tackles?.total) {
        const tacklesPerGame = getStatPerGame(player.statistics.tackles.total, appearances);
        const interceptionsPerGame = getStatPerGame(player.statistics.tackles.interceptions, appearances);
        score += (tacklesPerGame * 0.5) + (interceptionsPerGame * 0.7);
    }
    
    // Passing trait scoring
    if (getTraitEffects(traits).passing && player.statistics?.passes?.key) {
        const keyPassesPerGame = getStatPerGame(player.statistics.passes.key, appearances);
        const passingMultiplier = position === 'midfielder' ? 1.2 : 0.8;
        score += keyPassesPerGame * passingMultiplier;
    }

    // High pressure trait scoring
    if (getTraitEffects(traits).pressure && player.statistics?.tackles?.total) {
        const tacklesPerGame = getStatPerGame(player.statistics.tackles.total, appearances);
        const interceptionsPerGame = getStatPerGame(player.statistics.tackles.interceptions, appearances);
        const foulsPerGame = getStatPerGame(player.statistics.fouls?.committed, appearances);
        score += (tacklesPerGame * 0.6) + (interceptionsPerGame * 0.4) - (foulsPerGame * 0.2);
    }

    // Attacking trait scoring
    if (getTraitEffects(traits).attacking && player.statistics?.goals) {
        const goalsPerGame = getStatPerGame(player.statistics.goals.total, appearances);
        const assistsPerGame = getStatPerGame(player.statistics.goals.assists, appearances);
        
        let goalMultiplier = position === 'attacker' || position === 'forward' ? 1.5 :
                            position === 'midfielder' ? 0.8 : 0;
        
        score += (goalsPerGame * goalMultiplier) + (assistsPerGame * 0.5);
    }

    // Wing play trait scoring
    if (getTraitEffects(traits).wingPlay && player.statistics?.goals?.assists) {
        const assistsPerGame = getStatPerGame(player.statistics.goals.assists, appearances);
        if (position === 'midfielder') {
            score += assistsPerGame * 1.3;
        } else if (position === 'attacker' || position === 'forward') {
            score += assistsPerGame * 1.5;
        }
    }

    // Aggressive tackling trait scoring
    if (getTraitEffects(traits).aggressive && player.statistics?.tackles?.total) {
        const tacklesPerGame = getStatPerGame(player.statistics.tackles.total, appearances);
        score += tacklesPerGame * 1.0;
    }

    // Youth focus trait scoring
    if (getTraitEffects(traits).youth && player.player?.age) {
        const age = player.player.age;
        let ageScore = 0;
        
        if (age >= 18 && age <= 21) {
            ageScore = 5;  // Increased peak value for ideal age range
        } else {
            // Calculate how far from the ideal range
            const distanceFromIdeal = age < 18 ? 18 - age : age - 21;
            // Steeper decrease of 0.5 points per year away from ideal range
            ageScore = Math.max(-3, 5 - (distanceFromIdeal * 0.5));
        }
        
        score += ageScore;
    }
    
    // Experience focus trait scoring
    if (getTraitEffects(traits).experience && player.player?.age) {
        const age = player.player.age;
        let ageScore = 0;
        
        if (age >= 28 && age <= 32) {
            ageScore = 5;  // Peak value for experienced age range
        } else {
            // Calculate how far from the ideal range
            const distanceFromIdeal = age < 28 ? 28 - age : age - 32;
            // Same scoring system as youth but centered on different age range
            ageScore = Math.max(-3, 5 - (distanceFromIdeal * 0.5));
        }
        
        score += ageScore;
    }

    
    // Teamwork focus trait scoring
    if (getTraitEffects(traits).teamwork) {
        // Penalize cards
        const redCards = getStatPerGame(player.statistics?.cards?.red, appearances);
        const yellowCards = getStatPerGame(player.statistics?.cards?.yellow, appearances);
        score -= (redCards * 2) + (yellowCards * 0.5);
        
        // Value assists and key passes
        const assistsPerGame = getStatPerGame(player.statistics?.goals?.assists, appearances);
        const keyPassesPerGame = getStatPerGame(player.statistics?.passes?.key, appearances);
        score += (assistsPerGame * 1.2) + (keyPassesPerGame * 0.4);
        
        // Penalty for "selfish" players (high goals, low assists)
        const goalsPerGame = getStatPerGame(player.statistics?.goals?.total, appearances);
        if (goalsPerGame > assistsPerGame * 2) {
            score -= (goalsPerGame - assistsPerGame * 2) * 0.3;
        }
    }

    // Set piece specialists trait scoring
    if (getTraitEffects(traits).setPiece) {
        const assistsPerGame = getStatPerGame(player.statistics?.goals?.assists, appearances);
        const goalsPerGame = getStatPerGame(player.statistics?.goals?.total, appearances);
        
        if (position === 'midfielder') {
            score += assistsPerGame * 1.5;
        } else if (position === 'defender') {
            score += goalsPerGame * 2.0;
        }
    }
    

    return score;
}

export function executePick(teamId, isPlayer, playerTeam, teams, processedPlayers, player = null, statistics = null, transferValue = null) {
    const team = teamId === 'player' ? playerTeam : teams[teamId];
    const traits = team.traits || [];
    
    if (!isPlayer) {
        // Adjust slice size for star power teams
        const sliceSize = getTraitEffects(traits).starPower ?
            Math.floor(Math.random() * 4) + 8 :   // 8-11 players for star focus
            Math.floor(Math.random() * 7) + 12;   // 12-18 players normally
            
        const affordablePlayers = processedPlayers.filter(p => p.transferValue <= team.transferBudget);
        
        if (affordablePlayers.length === 0) {
            console.log("No affordable players available");
            return false;
        }

        const positionScores = getPositionalNeedScore(team, traits);
        const scoredPlayers = affordablePlayers.slice(0, sliceSize).map((p, index) => ({
            ...p,
            score: getValueBasedScore(index, p, traits) + 
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
    
    while (nextPlayerIndex < 210 && 
           nextPlayerIndex < draftOrderList.length && 
           draftOrderList[nextPlayerIndex].id !== 'player') {
        const result = executePick(draftOrderList[nextPlayerIndex].id, false, playerTeam, teams, processedPlayers);
        if (result) {
            processedPlayers = result.processedPlayers;
        }
        nextPlayerIndex++;
    }

    if (nextPlayerIndex >= draftOrderList.length || nextPlayerIndex >= 210) {
        draft.complete = true;
        console.log("Draft complete!");
        return processedPlayers;
    }

    draft.currentRound = Math.floor(nextPlayerIndex / 14) + 1;
    draft.currentPick = (nextPlayerIndex % 14) + 1;
    
    draft.currentTeam = draftOrderList[nextPlayerIndex].id === 'player' ? 
        playerTeam.name : draftOrderList[nextPlayerIndex].name;
    
    draft.nextTeam = nextPlayerIndex + 1 < draftOrderList.length && nextPlayerIndex + 1 < 210 ? 
        (draftOrderList[nextPlayerIndex + 1].id === 'player' ? 
            playerTeam.name : draftOrderList[nextPlayerIndex + 1].name) : 
        'None';

    return processedPlayers;
}