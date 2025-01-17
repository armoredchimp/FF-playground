let singleNameFirsts = new Map();  // Track count of first names used alone
let doubleNameFirsts = new Map();  // Track count of first names used in combinations
let usedSecondParts = new Set();


export function calculateTransferValue(player, statistics) {
    let baseValue = 2.0;
    
    
    if (!statistics) return baseValue;

    const minutes = statistics.games?.minutes || 0;
    const gamesPlayed90 = minutes / 90;
    if (gamesPlayed90 < 1) return 0.1;

    const isDefender = statistics.games?.position === 'Defender';
    const isGoalkeeper = statistics.games?.position === 'Goalkeeper';

    // Stronger minutes-based scaling
    const minutesScaling = Math.min(1.5, Math.max(0.3, minutes / 2000));
    
    // Age factor (reduced impact)
    const ageFactor = Math.max(0.8, 1 - (Math.abs(player.age - 26) * 0.025));

    // Game time value with increased defender bonus for consistency
    const appearanceRatio = (statistics.games?.appearences || 0) / 38;
    const minutesRatio = minutes / 3420;
    const consistencyBonus = isDefender ? 
        (appearanceRatio * 1.2 + minutesRatio * 1.2) : 
        (appearanceRatio * 1.0 + minutesRatio * 1.0);
    
    const appearanceBonus = Math.min(1.0, (statistics.games?.appearences || 0) * 0.04);
    const minutesValue = (statistics.games?.minutes || 0) * 0.0004;

    // Rating impact with enhanced goalkeeper rating importance
    const rating = Number(statistics.games?.rating || 6.6);
    const ratingDiff = rating - 6.6;
    const ratingMultiplier = isGoalkeeper ?
        (ratingDiff > 0 ? 1 + (ratingDiff * 0.8) : 1 + (ratingDiff * 0.9)) :
        isDefender ? 
            (ratingDiff > 0 ? 1 + (ratingDiff * 0.5) : 1 + (ratingDiff * 0.6)) :
            (ratingDiff > 0 ? 1 + (ratingDiff * 0.4) : 1 + (ratingDiff * 0.5));

    // Goal and assist values with efficiency bonus
    const goalsValue = ((statistics.goals?.total || 0) / gamesPlayed90) * 12.0;
    const assistsValue = ((statistics.goals?.assists || 0) / gamesPlayed90) * 1.5;
    
    // New efficiency bonus based on goals+assists per appearance
    const appearances = statistics.games?.appearences || 0;
    const totalGoals = statistics.goals?.total || 0;
    const totalAssists = statistics.goals?.assists || 0;
    const goalsAndAssists = totalGoals + totalAssists;
    const efficiencyRatio = appearances > 0 ? goalsAndAssists / appearances : 0;
    
    // Exponential bonus for high efficiency (kicks in strongly above 0.5 G+A per game)
    const efficiencyBonus = efficiencyRatio > 0.5 ? 
        Math.pow(efficiencyRatio - 0.5, 2) * 10.0 : 0;
    const shotAccuracy = (statistics.shots?.on || 0) / (statistics.shots?.total || 1) * 1.0;
    
    // Multi-tiered passing accuracy system
    const passAccuracy = typeof statistics.passes?.accuracy === 'number' ? statistics.passes.accuracy : 55;
    let passAccuracyModifier;
    if (passAccuracy <= 45) {
        passAccuracyModifier = (passAccuracy - 50) * 0.2;
    } else if (passAccuracy < 50) {
        passAccuracyModifier = (passAccuracy - 50) * 0.1;
    } else if (passAccuracy >= 80) {
        passAccuracyModifier = (passAccuracy - 65) * 0.15;
    } else if (passAccuracy >= 75) {
        passAccuracyModifier = (passAccuracy - 65) * 0.1;
    } else if (passAccuracy > 65) {
        passAccuracyModifier = (passAccuracy - 65) * 0.05;
    } else {
        passAccuracyModifier = 0;
    }
    
    const passAccuracyBonus = isDefender ? 
        passAccuracyModifier * 2 : 
        passAccuracyModifier;
        
    const passValue = ((statistics.passes?.total || 0) / gamesPlayed90) * 0.002;
    
    // Increased key passes value
    const keyPassesP90 = ((statistics.passes?.key || 0) / gamesPlayed90);
    const keyPassValue = keyPassesP90 * 0.8;
    const keyPassBonus = statistics.passes?.key > 50 ? (statistics.passes.key - 50) * 0.1 : 0;
    
    // Defensive contributions
    const defenderMultiplier = isDefender ? 3.0 : 1.0;
    const tackleValue = ((statistics.tackles?.total || 0) / gamesPlayed90) * 0.3 * defenderMultiplier;
    const interceptValue = ((statistics.tackles?.interceptions || 0) / gamesPlayed90) * 0.3 * defenderMultiplier;
    const blockValue = ((statistics.tackles?.blocks || 0) / gamesPlayed90) * 0.2 * defenderMultiplier;
    
    // Enhanced Goalkeeper specific stats
    const savesValue = isGoalkeeper ? 
        ((statistics.goals?.saves || 0) / gamesPlayed90) * 0.45 : // Tripled from 0.15
        ((statistics.goals?.saves || 0) / gamesPlayed90) * 0.15;
    const cleanSheetBonus = statistics.goals?.conceded === 0 ? 
        (isGoalkeeper ? 4.5 : 1.5) : 0; // Tripled for goalkeepers
    
    // Duel success with defender bonus
    const duelValue = statistics.duels?.total ?
        ((statistics.duels.won || 0) / statistics.duels.total) * (isDefender ? 1.5 : 1.0) : 0;
    
    // Discipline penalty (reduced for goalkeepers)
    const disciplineMultiplier = isGoalkeeper ? 1.5 : (isDefender ? 2.5 : 1.0);
    const disciplineValue = (
        ((statistics.cards?.yellow || 0) / gamesPlayed90 * -0.4) +
        ((statistics.cards?.red || 0) / gamesPlayed90 * -2.5)
    ) * disciplineMultiplier;

    
    const rawValue = (baseValue +
        appearanceBonus +
        minutesValue +
        consistencyBonus +
        passAccuracyBonus +
        goalsValue +
        assistsValue +
        efficiencyBonus +
        shotAccuracy +
        passValue +
        keyPassValue +
        keyPassBonus +
        tackleValue +
        interceptValue +
        blockValue +
        savesValue +
        cleanSheetBonus +
        duelValue +
        disciplineValue);

    
    const scaledValue = rawValue * minutesScaling;
    const totalValue = scaledValue * ageFactor * ratingMultiplier;
    return Math.max(totalValue, 0.1);
}

export function generateClubTraits() {
    const possibleTraits = [
        'Favors Defense',
        'Strong Passing',
        'High Pressure',
        'Favors Attacking',
        'Wing Play',
        'Aggressive Tackling',
        'Youth Focus',
        'Favors Experience',
        'Teamwork Focus',
        'Set Piece Specialists'
    ];
    
    // Randomly decide how many traits (0-2)
    const numTraits = Math.floor(Math.random() * 3);
    
    // Create a copy of possible traits to draw from
    const availableTraits = [...possibleTraits];
    const selectedTraits = [];
    
    // Select random traits
    for (let j = 0; j < numTraits; j++) {
        const randomIndex = Math.floor(Math.random() * availableTraits.length);
        const selectedTrait = availableTraits[randomIndex];
        selectedTraits.push(selectedTrait);
        
        // Remove selected trait to avoid duplicates
        availableTraits.splice(randomIndex, 1);
        
        // Handle mutually exclusive traits
        if (selectedTrait === 'Favors Defense') {
            const attackIndex = availableTraits.indexOf('Favors Attacking');
            if (attackIndex > -1) availableTraits.splice(attackIndex, 1);
        }
        else if (selectedTrait === 'Favors Attacking') {
            const defenseIndex = availableTraits.indexOf('Favors Defense');
            if (defenseIndex > -1) availableTraits.splice(defenseIndex, 1);
        }
        else if (selectedTrait === 'Youth Focus') {
            const experienceIndex = availableTraits.indexOf('Favors Experience');
            if (experienceIndex > -1) availableTraits.splice(experienceIndex, 1);
        }
        else if (selectedTrait === 'Favors Experience') {
            const youthIndex = availableTraits.indexOf('Youth Focus');
            if (youthIndex > -1) availableTraits.splice(youthIndex, 1);
        }
    }

    return selectedTraits;
}

export function generateClubName(firstParts, commonNames, secondParts) {
    const isDoubleName = Math.random() < 0.8; // 4/5 chance for double name
    
    if (isDoubleName) {
        // Get available first parts (not used alone and used <2 times in combinations)
        const availableFirsts = firstParts.filter(name => 
            !singleNameFirsts.has(name) && 
            (doubleNameFirsts.get(name) || 0) < 2
        );
        
        const firstPart = availableFirsts[Math.floor(Math.random() * availableFirsts.length)];
        doubleNameFirsts.set(firstPart, (doubleNameFirsts.get(firstPart) || 0) + 1);
        
        // For second part, either use common name or unused second part
        let secondPart;
        // 0.4 chance for common name
        if (Math.random() < 0.4) {
            secondPart = commonNames[Math.floor(Math.random() * commonNames.length)];
        } else {
            const availableSeconds = secondParts.filter(name => !usedSecondParts.has(name));
            secondPart = availableSeconds[Math.floor(Math.random() * availableSeconds.length)];
            usedSecondParts.add(secondPart);
        }
        
        return `${firstPart} ${secondPart}`;
        
    } else {
        // Get available first parts (not used in combinations and used <2 times alone)
        const availableFirsts = firstParts.filter(name => 
            !doubleNameFirsts.has(name) && 
            (singleNameFirsts.get(name) || 0) < 2
        );
        
        const firstPart = availableFirsts[Math.floor(Math.random() * availableFirsts.length)];
        singleNameFirsts.set(firstPart, (singleNameFirsts.get(firstPart) || 0) + 1);
        
        return firstPart;
    }
}

export function assignDraftOrder(numberPool) {
    if (numberPool.length === 0) {
        return null;
    }
    
    const randomIndex = Math.floor(Math.random() * numberPool.length);
    return numberPool.splice(randomIndex, 1)[0];
}

export function processPlayersData(players, container) {
    for (const item of players) {
        const eplStats = item.statistics.find(stat => 
            stat.league.name === 'Premier League' && 
            stat.games.appearences !== null
        );

        if (eplStats) {
            container.push({
                player: item.player,
                statistics: eplStats,
                transferValue: calculateTransferValue(item.player, eplStats)
            });
        }
    }
}

// Helper function for draft order organization
export function organizeDraftOrder(playerTeam, teams) {
    // Get all teams including player team
    const allTeams = [
        { id: 'player', ...playerTeam },
        ...Object.entries(teams).map(([key, team]) => ({ id: key, ...team }))
    ];

    // Sort by draft order
    allTeams.sort((a, b) => a.draftOrder - b.draftOrder);

    // Create snake draft order for 15 rounds
    const fullDraftOrder = [];
    for (let round = 0; round < 15; round++) {
        if (round % 2 === 0) {
            // Forward order
            fullDraftOrder.push(...allTeams.map(team => ({
                ...team,
                round: round + 1,
                pick: round % 2 === 0 ? allTeams.indexOf(team) + 1 : allTeams.length - allTeams.indexOf(team)
            })));
        } else {
            // Reverse order
            fullDraftOrder.push(...[...allTeams].reverse().map(team => ({
                ...team,
                round: round + 1,
                pick: round % 2 === 0 ? allTeams.indexOf(team) + 1 : allTeams.length - allTeams.indexOf(team)
            })));
        }
    }

    return fullDraftOrder;
}