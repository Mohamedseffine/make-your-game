import { elements,gameState} from "./config.js";
import { togglePause } from "./ui.js";
import { createShot } from "./shots.js";

export function setupEventListeners() {
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        
        // Touch controls for mobile
        let touchStartX = 0;
        elements.board.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            e.preventDefault();
        });
        
        elements.board.addEventListener('touchmove', (e) => {
            const touchX = e.touches[0].clientX;
            const diff = touchX - touchStartX;
            
            if (Math.abs(diff) > 10) {
                gameState.shipX += diff * 2;
                touchStartX = touchX;
                
                // Constrain to board
                const maxX = elements.board.clientWidth - elements.ship.offsetWidth;
                gameState.shipX = Math.max(0, Math.min(gameState.shipX, maxX));
                elements.ship.style.left = `${gameState.shipX}px`;
            }
            e.preventDefault();
        });
        
        elements.board.addEventListener('touchend', (e) => {
            if (!gameState.pause && !gameState.gameOver && 
                Date.now() >= gameState.lastShotTime + 350) {
                createShot();
                gameState.lastShotTime = Date.now();
            }
            e.preventDefault();
        });
}

export  function handleKeyDown(e) {
        gameState.keysPressed[e.key] = true;
        
        if (e.key === "Escape") {
            togglePause();
        }
        
        if (e.key === " " && Date.now() >= gameState.lastShotTime + 350 && !gameState.pause && !gameState.gameOver) {
            e.preventDefault();
            createShot();
            gameState.lastShotTime = Date.now();
        }
}

export function handleKeyUp(e) {
        gameState.keysPressed[e.key] = false;
}