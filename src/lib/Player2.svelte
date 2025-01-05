<script>
    let { player = {
      id: 0,
      name: '',
      age: 0,
      firstname: '',
      lastname: '',
      nationality: '',
      photo: ''
    } } = $props();

    
  </script>
  
  <div class="player-card">
    {#if player.photo}
      <img src={player.photo} alt={player.name} class="player-photo" />
    {/if}
    <div class="info">
      <h3>{player.name || `${player.firstname} ${player.lastname}`}</h3>
      <p>Age: {player.age} • {player.nationality}</p>
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
  
    .player-photo {
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