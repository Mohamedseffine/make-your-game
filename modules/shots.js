import { elements,gameState } from "./config.js";
import { checkShipCollision ,hitShip} from "./ship.js";
import { updateScore } from "./ui.js";

export function createShot() {
        let shot = document.createElement("div");
        shot.className = "shot";
        const shipCenterX = gameState.shipX + elements.ship.offsetWidth / 2;
        shot.style.left = `${shipCenterX - 1.5}px`; // Center the 3px wide shot
        shot.style.bottom = `${elements.ship.offsetHeight + 20}px`; // Start from top of ship
        elements.board.appendChild(shot);
        gameState.shots.push(shot);
}

export function updateShots(deltaTime) {
        const shotSpeed = 480;
        const moveAmount = shotSpeed * deltaTime;
        
        for (let i = gameState.shots.length - 1; i >= 0; i--) {
            const shot = gameState.shots[i];
            let bottom = parseFloat(shot.style.bottom) || 0;
            bottom += moveAmount;
            
            if (bottom > elements.board.clientHeight) {
                shot.remove();
                gameState.shots.splice(i, 1);
                continue;
            }
            
            shot.style.bottom = bottom + "px";
            checkShotCollisions(shot, i);
        }
}

export     function checkShotCollisions(shot, shotIndex) {
        const aliens = document.getElementsByClassName('alien-cont');
        const shotRect = shot.getBoundingClientRect();
        
        for (let j = aliens.length - 1; j >= 0; j--) {
            const alien = aliens[j];
            const alienRect = alien.getBoundingClientRect();
            
            if (
                shotRect.left < alienRect.right &&
                shotRect.right > alienRect.left &&
                shotRect.top < alienRect.bottom &&
                shotRect.bottom > alienRect.top
            ) {
                alien.remove();
                shot.remove();
                gameState.shots.splice(shotIndex, 1);
                updateScore(200);
                break;
            }
        }
}

export function updateAlienShots(deltaTime) {
        const shotSpeed = 300;
        const moveAmount = shotSpeed * deltaTime;
        
        for (let i = gameState.alienShots.length - 1; i >= 0; i--) {
            const shot = gameState.alienShots[i];
            let top = parseFloat(shot.style.top) || 0;
            top += moveAmount;
            
            if (top > elements.board.clientHeight) {
                shot.remove();
                gameState.alienShots.splice(i, 1);
                continue;
            }
            
            shot.style.top = top + "px";
            
            if (checkShipCollision(shot)) {
                shot.remove();
                gameState.alienShots.splice(i, 1);
                hitShip();
                continue;
            }
        }
}

export function alienShoot() {
        if (gameState.pause || gameState.gameOver) return;
        
        const aliens = document.getElementsByClassName('alien-cont');
        if (aliens.length === 0) return;
        
        if (Math.random() < gameState.alienFireRate * aliens.length) {
            const shooter = aliens[Math.floor(Math.random() * aliens.length)];
            
            const shot = document.createElement("div");
            shot.className = "alien-shot";
            shot.style.left = (shooter.offsetLeft + shooter.offsetWidth / 2 - 2) + "px";
            shot.style.top = (shooter.offsetTop + shooter.offsetHeight) + "px";
            elements.board.appendChild(shot);
            gameState.alienShots.push(shot);
        }
}