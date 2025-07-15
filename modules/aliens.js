import { elements,gameState } from "./config.js";
import { endGame } from "./gameover.js";
export function moveAliens(deltaTime) {
    if (gameState.pause || gameState.gameOver) return;

    gameState.alienMoveTimer += deltaTime;

    if (gameState.alienMoveTimer >= gameState.alienMoveInterval) {
        const aliens = Array.from(document.getElementsByClassName('alien-cont'));
        if (aliens.length === 0) return;

        const moveAmount = gameState.direction * gameState.alienSpeed;

        let rightMost = 0;
        let leftMost = elements.board.clientWidth;

        // Move aliens horizontally
        for (let alien of aliens) {
            const currentLeft = parseFloat(alien.style.left) || 0;
            const newLeft = currentLeft + moveAmount;
            alien.style.left = `${newLeft}px`;

            rightMost = Math.max(rightMost, newLeft + alien.offsetWidth);
            leftMost = Math.min(leftMost, newLeft);
        }

        // Check for wall collision
        //

        gameState.alienMoveTimer = 0;
    }
}
