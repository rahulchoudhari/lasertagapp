// Game State
let gameState = {
    tournament: null,
    teams: [],
    currentRound: 0,
    roundsToWin: 0,
    gameStarted: false,
    roundWins: {}
};

// Team Colors
const DEFAULT_COLORS = [
    { name: 'Red', color: '#dc3545' },
    { name: 'Blue', color: '#007bff' },
    { name: 'Green', color: '#28a745' },
    { name: 'Yellow', color: '#ffc107' }
];

// DOM Elements
const setupSection = document.getElementById('setup-section');
const gameSection = document.getElementById('game-section');
const numTeamsInput = document.getElementById('num-teams');
const playersPerTeamInput = document.getElementById('players-per-team');
const tournamentTypeSelect = document.getElementById('tournament-type');
const teamColorsContainer = document.getElementById('team-colors-container');
const createTournamentBtn = document.getElementById('create-tournament-btn');
const startGameBtn = document.getElementById('start-game-btn');
const resetBtn = document.getElementById('reset-btn');
const teamsGrid = document.getElementById('teams-grid');
const tournamentName = document.getElementById('tournament-name');
const currentRoundEl = document.getElementById('current-round');
const roundsToWinEl = document.getElementById('rounds-to-win');
const gameControls = document.getElementById('game-controls');
const endRoundBtn = document.getElementById('end-round-btn');
const nextRoundBtn = document.getElementById('next-round-btn');
const winnerAnnouncement = document.getElementById('winner-announcement');

// Event Listeners
numTeamsInput.addEventListener('change', generateTeamColorInputs);
createTournamentBtn.addEventListener('click', createTournament);
startGameBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetTournament);
endRoundBtn.addEventListener('click', endRound);
nextRoundBtn.addEventListener('click', nextRound);

// Initialize
generateTeamColorInputs();

// Generate Team Color Inputs
function generateTeamColorInputs() {
    const numTeams = parseInt(numTeamsInput.value);
    teamColorsContainer.innerHTML = '';
    
    for (let i = 0; i < numTeams; i++) {
        const defaultTeam = DEFAULT_COLORS[i] || { name: `Team${i + 1}`, color: '#' + Math.floor(Math.random()*16777215).toString(16) };
        
        const div = document.createElement('div');
        div.className = 'team-color-input';
        div.innerHTML = `
            <label>Team ${i + 1}:</label>
            <input type="text" id="team-name-${i}" value="${defaultTeam.name}" placeholder="Team Name">
            <input type="color" id="team-color-${i}" value="${defaultTeam.color}">
        `;
        teamColorsContainer.appendChild(div);
    }
}

// Create Tournament
function createTournament() {
    const numTeams = parseInt(numTeamsInput.value);
    const playersPerTeam = parseInt(playersPerTeamInput.value);
    const tournamentType = parseInt(tournamentTypeSelect.value);
    
    if (numTeams < 2 || numTeams > 4) {
        alert('Please select 2-4 teams');
        return;
    }
    
    if (playersPerTeam < 1) {
        alert('Please select at least 1 player per team');
        return;
    }
    
    // Create teams
    gameState.teams = [];
    for (let i = 0; i < numTeams; i++) {
        const teamNameInput = document.getElementById(`team-name-${i}`);
        const teamColorInput = document.getElementById(`team-color-${i}`);
        
        const team = {
            id: i,
            name: teamNameInput.value,
            color: teamColorInput.value,
            players: []
        };
        
        // Create players for this team
        for (let j = 0; j < playersPerTeam; j++) {
            team.players.push({
                id: `${i}-${j}`,
                name: `${team.name}-Player-${j + 1}`,
                active: true,
                terminated: false
            });
        }
        
        gameState.teams.push(team);
        gameState.roundWins[team.name] = 0;
    }
    
    gameState.tournament = `Best of ${tournamentType}`;
    gameState.roundsToWin = Math.ceil(tournamentType / 2);
    gameState.currentRound = 0;
    gameState.gameStarted = false;
    
    // Update UI
    setupSection.classList.add('hidden');
    gameSection.classList.remove('hidden');
    tournamentName.textContent = gameState.tournament;
    roundsToWinEl.textContent = gameState.roundsToWin;
    currentRoundEl.textContent = gameState.currentRound;
    
    renderTeams();
}

// Render Teams Grid
function renderTeams() {
    teamsGrid.innerHTML = '';
    
    gameState.teams.forEach(team => {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team-container';
        teamDiv.style.borderColor = team.color;
        
        const teamHeader = document.createElement('div');
        teamHeader.className = 'team-header';
        teamHeader.style.backgroundColor = team.color;
        teamHeader.textContent = team.name;
        if (gameState.roundWins[team.name]) {
            teamHeader.textContent += ` - Wins: ${gameState.roundWins[team.name]}`;
        }
        teamDiv.appendChild(teamHeader);
        
        const playersGrid = document.createElement('div');
        playersGrid.className = 'players-grid';
        
        team.players.forEach(player => {
            const playerTile = document.createElement('div');
            playerTile.className = `player-tile ${player.terminated ? 'terminated' : 'active'}`;
            playerTile.innerHTML = `
                <div class="player-name">${player.name}</div>
                <div class="player-status">${player.terminated ? 'Terminated' : 'Active'}</div>
            `;
            
            if (gameState.gameStarted && !player.terminated) {
                playerTile.addEventListener('click', () => terminatePlayer(team.id, player.id));
            }
            
            playersGrid.appendChild(playerTile);
        });
        
        teamDiv.appendChild(playersGrid);
        teamsGrid.appendChild(teamDiv);
    });
}

// Start Game
function startGame() {
    gameState.gameStarted = true;
    gameState.currentRound = 1;
    currentRoundEl.textContent = gameState.currentRound;
    
    startGameBtn.classList.add('hidden');
    gameControls.classList.remove('hidden');
    
    renderTeams();
}

// Terminate Player
function terminatePlayer(teamId, playerId) {
    if (!gameState.gameStarted) return;
    
    const team = gameState.teams.find(t => t.id === teamId);
    const player = team.players.find(p => p.id === playerId);
    
    if (player && !player.terminated) {
        if (confirm(`Terminate ${player.name}?`)) {
            player.terminated = true;
            renderTeams();
        }
    }
}

// End Round
function endRound() {
    const teamScores = gameState.teams.map(team => ({
        name: team.name,
        color: team.color,
        activePlayers: team.players.filter(p => !p.terminated).length
    }));
    
    // Find winner of this round (team with most active players)
    teamScores.sort((a, b) => b.activePlayers - a.activePlayers);
    
    if (teamScores[0].activePlayers > 0) {
        const roundWinner = teamScores[0].name;
        gameState.roundWins[roundWinner]++;
        
        alert(`Round ${gameState.currentRound} Winner: ${roundWinner}\nActive Players: ${teamScores[0].activePlayers}`);
        
        // Check if tournament winner
        if (gameState.roundWins[roundWinner] >= gameState.roundsToWin) {
            endTournament(roundWinner);
            return;
        }
    } else {
        alert('Round ended in a tie - all players terminated!');
    }
    
    endRoundBtn.classList.add('hidden');
    nextRoundBtn.classList.remove('hidden');
}

// Next Round
function nextRound() {
    // Reset all players for new round
    gameState.teams.forEach(team => {
        team.players.forEach(player => {
            player.terminated = false;
        });
    });
    
    gameState.currentRound++;
    currentRoundEl.textContent = gameState.currentRound;
    
    nextRoundBtn.classList.add('hidden');
    endRoundBtn.classList.remove('hidden');
    
    renderTeams();
}

// End Tournament
function endTournament(winner) {
    gameState.gameStarted = false;
    gameControls.classList.add('hidden');
    
    const winnerTeam = gameState.teams.find(t => t.name === winner);
    
    winnerAnnouncement.innerHTML = `
        <h2>🏆 Tournament Winner 🏆</h2>
        <p style="font-size: 2em; font-weight: bold;">${winner}</p>
        <p>Rounds Won: ${gameState.roundWins[winner]} / ${gameState.roundsToWin}</p>
    `;
    winnerAnnouncement.style.background = `linear-gradient(135deg, ${winnerTeam.color} 0%, ${adjustColor(winnerTeam.color, -30)} 100%)`;
    winnerAnnouncement.classList.remove('hidden');
    
    renderTeams();
}

// Reset Tournament
function resetTournament() {
    if (confirm('Are you sure you want to reset the tournament?')) {
        gameState = {
            tournament: null,
            teams: [],
            currentRound: 0,
            roundsToWin: 0,
            gameStarted: false,
            roundWins: {}
        };
        
        setupSection.classList.remove('hidden');
        gameSection.classList.add('hidden');
        winnerAnnouncement.classList.add('hidden');
        gameControls.classList.add('hidden');
        startGameBtn.classList.remove('hidden');
        
        generateTeamColorInputs();
    }
}

// Utility function to adjust color brightness
function adjustColor(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}
