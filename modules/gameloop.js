import { elements,gameState } from "./config.js";
import { updateShipPosition } from "./ship.js";
import { updateShots, updateAlienShots,alienShoot } from "./shots.js";
import { moveAliens } from "./aliens.js";
import { nextLevel } from "./initgame.js";

export  function update(timestamp) {
        if (!gameState.lastFrameTime) gameState.lastFrameTime = timestamp;
        const deltaTime = (timestamp - gameState.lastFrameTime) / 1000;
        gameState.lastFrameTime = timestamp;
        
        if (gameState.invincibleTimer > 0) {
            gameState.invincibleTimer -= deltaTime;
            if (gameState.invincibleTimer <= 0) {
                elements.ship.style.opacity = "1";
            }
        }
        
        if (!gameState.pause && !gameState.gameOver) {
            updateShipPosition(deltaTime);
            updateShots(deltaTime);
            updateAlienShots(deltaTime);
            moveAliens(deltaTime);
            alienShoot();
            
            if (document.getElementsByClassName('alien-cont').length === 0) {
                nextLevel();
            }
        }
        
        requestAnimationFrame(update);
}