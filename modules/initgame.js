import { setupUI,updateTime } from './ui.js';
import { createAliens } from './createaliens.js';
import { setupEventListeners } from './eventlisteners.js';
import { gameState, elements } from './config.js';
import { update} from './gameloop.js'
import { updateLivesDisplay } from './ui.js';

export function initGame() {
        setupUI();
        createAliens();
        setupEventListeners();
        startTimers();
        
        // Set initial ship position
        gameState.shipX = (elements.board.clientWidth - elements.ship.offsetWidth) / 2;
        elements.ship.style.left = `${gameState.shipX}px`;
        
        // Start the game loop
        requestAnimationFrame(update);
}

export  function restartGame() {
        // Reset game state
        gameState.lives = 3;
        gameState.currentscore = 0;
        gameState.time = 0;
        gameState.level = 1;
        gameState.gameOver = false;
        gameState.direction = 1;
        gameState.alienFireRate = 0.005;
        gameState.pause = false ;
        
        // Clear all shots
        gameState.shots.forEach(shot => shot.remove());
        gameState.shots = [];
        gameState.alienShots.forEach(shot => shot.remove());
        gameState.alienShots = [];
        
        // Reset displays
        elements.score.textContent = "Score: 0";
        elements.timeDisplay.textContent = "Time: 0:00";
        updateLivesDisplay();
        
        // Hide game over screen and menu
        elements.gameOverScreen.style.display = 'none';
        elements.menu.style.display = 'none';
        elements.blurr.style.display = 'none';
        
        // Reset ship
        elements.ship.style.opacity = "1";
        elements.ship.style.visibility = 'visible';
        gameState.shipX = (elements.board.clientWidth - elements.ship.offsetWidth) / 2;
        elements.ship.style.left = `${gameState.shipX}px`;
        
        // Create new aliens
        createAliens();
}

export function startTimers() {
        setInterval(updateTime, 1000);
}

export  function nextLevel() {
        gameState.level++;
        gameState.direction *= gameState.alienSpeedIncrease;
        gameState.alienFireRate *= 1.5;
        
        const levelUp = document.createElement('div');
        levelUp.id = "next-level"
        levelUp.textContent = `LEVEL ${gameState.level}`;
        levelUp.style.position = 'fixed';
        levelUp.style.top = '50%';
        levelUp.style.left = '50%';
        levelUp.style.transform = 'translate(-50%, -50%)';
        levelUp.style.color = '#00ffff';
        levelUp.style.fontSize = '3rem';
        levelUp.style.textShadow = '0 0 10px #00ffff';
        levelUp.style.zIndex = '100';
        document.body.appendChild(levelUp);
        setTimeout(()=>{
                levelUp.remove()
        }, 1000)
        createAliens();
}