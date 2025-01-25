<script>
  import axios from "axios";

    let { player = {
      id: 0,
      name: '',
      age: 0,
      firstname: '',
      lastname: '',
      nationality: '',
      photo: ''
    }} = $props();

    let playerStats = $state(null)
    let hasAppearances = $state(false)
    let transferValue = $state(0)

    export function calculateTransferValue(player, statistics) {
        // Base value in millions
        let baseValue = 1.0;
        
        const stats = statistics;
        if (!stats) return baseValue;
    
        // Age factor (peak value around 26-27)
        const ageFactor = Math.max(0.7, 1 - (Math.abs(player.age - 26) * 0.05));
    
        // Game time value
        const appearanceValue = (stats.games?.appearences || 0) * 0.1;
        const minutesValue = (stats.games?.minutes || 0) * 0.0001;
    
        // Offensive contributions
        const goalsValue = (stats.goals?.total || 0) * 0.5;
        const assistsValue = (stats.goals?.assists || 0) * 0.3;
        const shotAccuracy = (stats.shots?.on || 0) / (stats.shots?.total || 1) * 0.5;
        
        // Passing & Creation
        const passValue = (stats.passes?.total || 0) * 0.001;
        const keyPassValue = (stats.passes?.key || 0) * 0.1;
        
        // Defensive contributions
        const tackleValue = (stats.tackles?.total || 0) * 0.05;
        const interceptValue = (stats.tackles?.interceptions || 0) * 0.05;
        const blockValue = (stats.tackles?.blocks || 0) * 0.05;
        
        // Goalkeeper specific (heavily weighted)
        const savesValue = (stats.goals?.saves || 0) * 0.2;
        const cleanSheetBonus = (stats.goals?.conceded === 0 ? 2.0 : 0);
        
        // Duel success
        const duelValue = stats.duels?.total ? 
        ((stats.duels.won || 0) / stats.duels.total) * 0.5 : 0;
        
        // Discipline penalty
        const disciplineValue = ((stats.cards?.yellow || 0) * -0.1) + 
        ((stats.cards?.red || 0) * -0.5);
    
        // Sum all contributions
        const totalValue = (baseValue + 
        appearanceValue + 
        minutesValue + 
        goalsValue + 
        assistsValue + 
        shotAccuracy + 
        passValue + 
        keyPassValue + 
        tackleValue + 
        interceptValue + 
        blockValue + 
        savesValue + 
        cleanSheetBonus + 
        duelValue + 
        disciplineValue) * ageFactor;
    
        // Return with minimum value of 0.1M
        return Math.max(totalValue, 0.1);
  }



    async function playerStatsCall(id){
      const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/players',
        params: {
          id: id,
          season: '2023'
        },
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_API_KEY,
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
      };

      try {
      const response = await axios.request(options);
      console.log(response.data.response)
      if (response.data.response?.[0]?.statistics) {
        // Find the primary competition stats (usually index 1)
        const primaryStats = response.data.response[0].statistics.find(
          (stat) => stat.games.appearences !== null
        );
        
        if (primaryStats) {
          playerStats = primaryStats;
          hasAppearances = true;
          transferValue = calculateTransferValue(player, primaryStats)
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

    $effect(() => {
      if (player.id) {
        playerStatsCall(player.id)
      }
    })
  </script>


  
{#if hasAppearances}
  <div class="player-card">
    {#if player.photo}
      <img src={player.photo} alt={player.name} class="player-photo" />
    {/if}
    {#if playerStats?.team?.logo}
      <img src={playerStats.team.logo} alt={playerStats.team.name} class="team-logo" />
    {/if}
    
    <div class="info">
      <h3>{player.name || `${player.firstname} ${player.lastname}`}</h3>
      <p>Age: {player.age} • {player.nationality}</p>
      
      <p class="team">{playerStats?.team?.name || 'N/A'}</p>
      
      <div class="stats-section">
        <p>Position: {playerStats?.games?.position || 'N/A'}</p>
        <p>Appearances: {playerStats?.games?.appearences ?? 'N/A'}</p>
        <p>Minutes: {playerStats?.games?.minutes ?? 'N/A'}</p>
        <p>Goals: {playerStats?.goals?.total ?? 'N/A'}</p>
        <p>Assists: {playerStats?.goals?.assists ?? 'N/A'}</p>
        <p>Rating: {Number(playerStats?.games?.rating).toFixed(1) ?? 'N/A'}</p>
        <p>Yellow Cards: {playerStats?.cards?.yellow ?? 'N/A'}</p>
        <p>Red Cards: {playerStats?.cards?.red ?? 'N/A'}</p>
        <p class="transfer-value">Estimated Value: £{transferValue.toFixed(2)}M</p>
      </div>
    </div>
  </div>

  {/if} 
  <style>
    .player-card {
      border: 1px solid #ddd;
      padding: 1rem;
      margin: 0.5rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  
    .player-photo, .team-logo {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
    }
  
    .info {
      flex: 1;
    }
  
    h3 {
      margin: 0;
      font-size: 1.1rem;
    }
  
    p {
      margin: 0.5rem 0 0;
      color: #666;
    }

    .transfer-value {
      font-weight: bold;
      color: #2d3748;
      margin-top: 1rem;
  }
  </style>