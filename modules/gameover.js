import { elements,gameState } from "./config.js";

export  function endGame() {
        gameState.gameOver = true;
        elements.finalScore.textContent = `Final Score: ${gameState.currentscore}`;
        elements.gameOverScreen.style.display = 'flex';
        gameState.time= 0;
}

// pause: false,
//         shipX: 0,
//         speed: 300,
//         keysPressed: {},
//         shots: [],
//         alienShots: [],
//         currentscore: 0,

//         lastShotTime: Date.now(),
//         direction: 120,
//         lastFrameTime: 0,
//         alienMoveTimer: 0,
//         alienMoveInterval: 1/15,
//         lives: 3,
//         level: 1,
//         gameOver: false,
//         alienRows: 3,
//         alienCols: 8,
//         alienSpeedIncrease: 1.1,
//         alienFireRate: 0.005,
//         invincibleTimer: 0