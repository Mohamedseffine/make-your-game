import { elements,gameState } from "./config.js";

export function moveAliens(deltaTime) {
        if (gameState.pause || gameState.gameOver) return;
        
        gameState.alienMoveTimer += deltaTime;
        
        if (gameState.alienMoveTimer >= gameState.alienMoveInterval) {
            const aliens = document.getElementsByClassName('alien-cont');
            let rightMost = 0;
            let leftMost = elements.board.clientWidth;
            const moveAmount = gameState.direction * gameState.alienMoveTimer;
            
            for (let i = 0; i < aliens.length; i++) {
                const alien = aliens[i];
                const currentLeft = parseFloat(alien.style.left);
                const newLeft = currentLeft + moveAmount;
                
                alien.style.left = newLeft + "px";
                rightMost = Math.max(rightMost, newLeft + alien.offsetWidth);
                leftMost = Math.min(leftMost, newLeft);
                
                // Check if aliens reached bottom
                if (parseFloat(alien.style.top) + alien.offsetHeight > 
                    elements.board.clientHeight - elements.ship.offsetHeight - 20) {
                    endGame();
                    return;
                }
            }
            
            if (rightMost >= elements.board.clientWidth || leftMost <= 0) {
                gameState.direction *= -1;
                
                // Move aliens down when they hit the side
                for (let i = 0; i < aliens.length; i++) {
                    const alien = aliens[i];
                    alien.style.top = (parseFloat(alien.style.top) + 20) + "px";
                }
            }
            
            gameState.alienMoveTimer = 0;
        }
}