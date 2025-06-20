import { elements ,gameState } from "./config.js";
import {updateLivesDisplay} from "./ui.js"
import { endGame } from "./gameover.js";

export function updateShipPosition(deltaTime) {
        const moveAmount = gameState.speed * deltaTime;
        
        if (gameState.keysPressed["ArrowLeft"]) {
            gameState.shipX -= moveAmount;
        }
        if (gameState.keysPressed["ArrowRight"]) {
            gameState.shipX += moveAmount;
        }
        
        // Strict boundary enforcement
        const maxX = elements.board.clientWidth - elements.ship.offsetWidth;
        gameState.shipX = Math.max(0, Math.min(gameState.shipX, maxX));
        
        elements.ship.style.left = `${gameState.shipX}px`;
}

export function checkShipCollision(shot) {
        const shotRect = shot.getBoundingClientRect();
        const shipRect = elements.ship.getBoundingClientRect();
        
        return (
            shotRect.left < shipRect.right &&
            shotRect.right > shipRect.left &&
            shotRect.top < shipRect.bottom &&
            shotRect.bottom > shipRect.top
        );
}

export function hitShip() {
        if (gameState.invincibleTimer > 0) return;
        
        gameState.lives--;
        updateLivesDisplay();
        
        if (gameState.lives <= 0) {
            endGame();
        } else {
            gameState.invincibleTimer = 2;
            elements.ship.style.opacity = "0.5";
            
            // Blink effect
            let blinkCount = 0;
            const blinkInterval = setInterval(() => {
                elements.ship.style.visibility = elements.ship.style.visibility === 'hidden' ? 'visible' : 'hidden';
                blinkCount++;
                
                if (blinkCount >= 8) {
                    clearInterval(blinkInterval);
                    elements.ship.style.visibility = 'visible';
                }
            }, 250);
        }
}