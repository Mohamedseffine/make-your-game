import { restartGame } from "./initgame.js";
import { gameState, elements } from "./config.js";

export function setupUI() {
  updateLivesDisplay();
  elements.continueBtn.addEventListener("click", togglePause);
  elements.restartBtn.addEventListener("click", restartGame);
  elements.playAgainBtn.addEventListener("click", restartGame);
}

// Update lives display
export function updateLivesDisplay() {
  elements.livesDisplay.textContent = `Lives: ${"❤️".repeat(gameState.lives)}`;
}

export function updateScore(points) {
  gameState.currentscore += points;
  elements.score.textContent = "Score: " + gameState.currentscore;
}

export function updateTime() {
  if (!gameState.pause) {
    gameState.time++;
  }

  let minutes = Math.floor(gameState.time / 60);
  let seconds = gameState.time % 60;
  if (seconds < 10) seconds = "0" + seconds;

  elements.timeDisplay.textContent = "Time: " + minutes + ":" + seconds;
}

export function togglePause() {
  gameState.pause = !gameState.pause;
  if (!gameState.gameOver) {
    // elements.blurr.style.display = gameState.pause ? "block" : "none";
    elements.menu.style.display = gameState.pause ? "flex" : "none";
  }
}
