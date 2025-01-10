import { teams } from "$lib/teams.svelte";


export function calculateTransferValue(player, statistics) {
    let baseValue = 2.0;
    
    
    if (!statistics) return baseValue;

    const minutes = statistics.games?.minutes || 0;
    const gamesPlayed90 = minutes / 90;
    if (gamesPlayed90 < 1) return 0.1;

    const isDefender = statistics.games?.position === 'Defender';

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

    // Rating impact
    const rating = Number(statistics.games?.rating || 6.6);
    const ratingDiff = rating - 6.6;
    const ratingMultiplier = isDefender ? 
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
    const keyPassValue = keyPassesP90 * 0.8; // Doubled from 0.4
    // Additional bonus for high volume of key passes
    const keyPassBonus = statistics.passes?.key > 50 ? (statistics.passes.key - 50) * 0.1 : 0;
    
    // Defensive contributions
    const defenderMultiplier = isDefender ? 3.0 : 1.0;
    const tackleValue = ((statistics.tackles?.total || 0) / gamesPlayed90) * 0.3 * defenderMultiplier;
    const interceptValue = ((statistics.tackles?.interceptions || 0) / gamesPlayed90) * 0.3 * defenderMultiplier;
    const blockValue = ((statistics.tackles?.blocks || 0) / gamesPlayed90) * 0.2 * defenderMultiplier;
    
    // Goalkeeper specific
    const savesValue = ((statistics.goals?.saves || 0) / gamesPlayed90) * 0.15;
    const cleanSheetBonus = (statistics.goals?.conceded === 0 ? 1.5 : 0);
    
    // Duel success with defender bonus
    const duelValue = statistics.duels?.total ?
        ((statistics.duels.won || 0) / statistics.duels.total) * (isDefender ? 1.5 : 1.0) : 0;
    
    // Discipline penalty
    const disciplineMultiplier = isDefender ? 2.5 : 1.0;
    const disciplineValue = (
        ((statistics.cards?.yellow || 0) / gamesPlayed90 * -0.4) +
        ((statistics.cards?.red || 0) / gamesPlayed90 * -2.5)
    ) * disciplineMultiplier;

    // Sum all contributions before minutes scaling
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

    // Apply minutes scaling before other multipliers
    const scaledValue = rawValue * minutesScaling;
    const totalValue = scaledValue * ageFactor * ratingMultiplier;
    return Math.max(totalValue, 0.1);
}

export function generateClubTraits() {
    // Define possible traits
    const possibleTraits = [
        'Favors Defense',
        'Strong Passing',
        'High Pressure',
        'Counter Attack',
        'Possession Based',
        'Wing Play',
        'Direct Football',
        'Youth Focus',
        'Aggressive Tackling',
        'Short Passing'
    ];

    // For each team in teams object
    for (let i = 1; i <= 13; i++) {
        // Randomly decide how many traits (0-2)
        const numTraits = Math.floor(Math.random() * 3); // 0, 1, or 2
        
        // Create a copy of possible traits to draw from
        const availableTraits = [...possibleTraits];
        const selectedTraits = [];

        // Select random traits
        for (let j = 0; j < numTraits; j++) {
            const randomIndex = Math.floor(Math.random() * availableTraits.length);
            selectedTraits.push(availableTraits[randomIndex]);
            // Remove selected trait to avoid duplicates within same team
            availableTraits.splice(randomIndex, 1);
        }

        // Assign traits to team
        teams[`team${i}`].traits = selectedTraits;
    }
}