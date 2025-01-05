<script>
  import axios from "axios";
	import { onMount } from "svelte";

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
      if (response.data.response?.[0]) {
        playerStats = response.data.response[0].statistics[0];
        $inspect(playerStats)
      }
    } catch (error) {
      console.error(error);
    }
    }

    onMount(() => {
      if (player.id) {
        playerStatsCall(player.id)
      }
    })
  </script>
  
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
        <p>Goals: {playerStats?.goals?.total ?? 'N/A'}</p>
        <p>Assists: {playerStats?.goals?.assists ?? 'N/A'}</p>
        <p>Rating: {playerStats?.games?.rating ?? 'N/A'}</p>
      </div>
    </div>
  </div>
  
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
  </style>