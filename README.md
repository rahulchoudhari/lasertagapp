# Lasertag Game Operator App

A web-based application for managing lasertag tournaments with multiple teams and players.

## Features

1. **Tournament Creation** - Choose between Best of 3 or Best of 5 tournament formats
2. **Team Management** - Create 2-4 teams with customizable names and colors
3. **Player Management** - Automatically generate player names based on team (e.g., Red-Player-1, Blue-Player-2)
4. **Game View** - Visual tile-based grid showing all players organized by team
5. **Player Termination** - Admin can mark players as terminated during gameplay
6. **Round Management** - Track rounds, determine winners, and progress through the tournament
7. **Tournament Winner** - Automatically determines and announces the tournament winner

## How to Use

### Setup
1. Open `index.html` in a web browser
2. Select tournament type (Best of 3 or Best of 5)
3. Choose number of teams (2-4)
4. Set players per team (1-10)
5. Customize team names and colors if desired
6. Click "Create Tournament"

### Gameplay
1. Click "Start Game" to begin the tournament
2. During gameplay, click on any active player tile to mark them as terminated
3. Click "End Round" when the round is complete
   - The team with the most active players wins the round
4. Click "Next Round" to reset all players and continue
5. Tournament ends when a team wins the required number of rounds

### Reset
- Click "Reset Tournament" at any time to start over with a new configuration

## Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript (no dependencies required)

## Running the Application

Simply open `index.html` in any modern web browser. No server or build process required.

For development or testing with a local server:
```bash
python3 -m http.server 8080
# Then open http://localhost:8080 in your browser
```