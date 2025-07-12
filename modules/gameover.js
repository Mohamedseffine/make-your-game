import { elements,gameState } from "./config.js";

export  function endGame() {
        gameState.gameOver = true;
        elements.finalScore.textContent = `Final Score: ${gameState.currentscore}`;
        elements.gameOverScreen.style.display = 'flex';
        gameState.time= 0;
}

