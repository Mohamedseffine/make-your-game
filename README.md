# Space Invaders (Vanilla JavaScript) — Web Game

A **Space Invaders–inspired** browser game built with **vanilla JavaScript** (no frameworks).  
Pilot your ship, shoot incoming aliens, avoid getting hit, and try to beat your high score.

---

## Features
- Classic Space Invaders gameplay (ship movement + shooting + alien formation)
- Modular codebase (game loop, UI, entities, input handling)
- Start menu + game over flow
- Simple, clean styling (CSS)
- Uses image sprites for the ship and aliens

---

## Controls

- **Arrow Left** — Move left  
- **Arrow Right** — Move right  
- **Space** — Shoot  
- **R** — Start / Restart (optional)

---

## Project Structure

```txt
.
├── index.html
├── style.css
├── script.js
├── alien.png
├── ship.png
├── TODO
└── modules/
    ├── aliens.js
    ├── config.js
    ├── createaliens.js
    ├── eventlisteners.js
    ├── gameloop.js
    ├── gameover.js
    ├── initgame.js
    ├── ship.js
    ├── shots.js
    ├── startMenu.js
    └── ui.js
```

### What each file does (high level)

- **index.html**  
  Main HTML page. Loads the styles and JavaScript and contains the game container/canvas/UI.

- **style.css**  
  Game layout and UI styling.

- **script.js**  
  Entry point. Typically imports/initializes modules and starts the game.

- **alien.png / ship.png**  
  Sprite images used for rendering aliens and the player ship.

- **modules/config.js**  
  Central configuration values (speeds, sizes, cooldowns, grid sizes, etc.).

- **modules/initgame.js**  
  Initializes a new game session (reset score, lives, entities, UI state).

- **modules/startMenu.js**  
  Start screen logic (start button, instructions, state transitions).

- **modules/gameloop.js**  
  The main loop (usually `requestAnimationFrame`): update positions, detect collisions, render, etc.

- **modules/eventlisteners.js**  
  Keyboard input listeners and input state handling.

- **modules/ship.js**  
  Player ship entity (position, movement constraints, render logic).

- **modules/shots.js**  
  Player shots (creation, movement, cleanup, collisions).

- **modules/createaliens.js**  
  Builds the initial alien formation (rows/cols layout).

- **modules/aliens.js**  
  Alien behavior and movement (formation shifting, dropping, direction changes, firing logic).

- **modules/ui.js**  
  Score / lives / HUD updates and DOM bindings.

- **modules/gameover.js**  
  Game over logic (stop loop, show final score, restart options).

---

## How to Run

### Option 1: Open directly
1. Open **index.html** in your browser (Chrome / Firefox).
2. Click **Start** (if you have a start menu) and play.

> If you run into issues loading ES modules due to browser security rules, use a local server (recommended).

### Option 2: Run with a local server (recommended)

**Python**
```bash
python3 -m http.server 8000
```

Then open:
- `http://localhost:8000`

**Node.js**
```bash
npx serve
```

---

## How the Game Works (overview)

Typical flow:
1. **Start menu** (startMenu.js) → click start
2. **Init game** (initgame.js) → reset state, create ship/aliens
3. **Game loop** (gameloop.js)  
   - Read inputs (eventlisteners.js)  
   - Update entities (ship.js, aliens.js, shots.js)  
   - Handle collisions + scoring (shots vs aliens, alien hits player, etc.)  
   - Update UI (ui.js)  
4. **Game over** (gameover.js) → stop the loop and show results

---

## Customization
Look in **modules/config.js** for settings like:
- Player speed
- Shot speed / cooldown
- Alien speed / drop distance
- Alien grid size (rows / columns)
- Lives / score values
- Difficulty scaling (if present)

---

## Ideas / Roadmap
- Multiple waves with increasing difficulty
- Alien shooting patterns
- Mobile controls
---
