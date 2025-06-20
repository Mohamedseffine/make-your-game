import {gameState, elements } from "./config.js";

export function createAliens() {
            elements.aliens.innerHTML = '';
            
            const alienSize = Math.min(
                elements.board.clientWidth * 0.08,
            elements.board.clientHeight * 0.08,
            40
        );
        
        const cols = Math.min(8, Math.floor(elements.board.clientWidth / (alienSize * 1.5)));
        const rows = Math.min(3, Math.floor(elements.board.clientHeight * 0.4 / alienSize));
        
        gameState.alienCols = cols;
        gameState.alienRows = rows;
        
        const startX = (elements.board.clientWidth - (cols * alienSize * 1.2)) / 2;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let alienContainer = document.createElement("div");
                let alien = document.createElement("div");
                
                alienContainer.className = "alien-cont";
                alien.className = "alien";
                
                const x = startX + col * alienSize * 1.2;
                const y = 20 + row * alienSize * 1.2;
                
                alienContainer.style.width = `${alienSize}px`;
                alienContainer.style.height = `${alienSize}px`;
                alienContainer.style.left = `${x}px`;
                alienContainer.style.top = `${y}px`;
                
                alienContainer.appendChild(alien);
                elements.aliens.appendChild(alienContainer);
            }
        }
}