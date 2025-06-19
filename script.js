window.onload = function () {
    // Game state variables
    const gameState = {
        pause: false,
        shipX: 0,
        speed: 300,
        keysPressed: {},
        shots: [],
        alienShots: [],
        currentscore: 0,
        time: 0,
        lastShotTime: Date.now(),
        direction: 120,
        lastFrameTime: 0,
        alienMoveTimer: 0,
        alienMoveInterval: 1/15,
        lives: 3,
        level: 1,
        gameOver: false,
        alienRows: 3,
        alienCols: 8,
        alienSpeedIncrease: 1.1,
        alienFireRate: 0.005,
        invincibleTimer: 0
    };

    // DOM elements
    const elements = {
        ship: document.getElementById("ship"),
        board: document.getElementById("board"),
        aliens: document.getElementById("aliens"),
        score: document.getElementById("score"),
        timeDisplay: document.getElementById("timeDisplay"),
        livesDisplay: document.getElementById("livesDisplay"),
        menu: document.getElementById("menu"),
        continueBtn: document.getElementById("continue"),
        restartBtn: document.getElementById("restart"),
        playAgainBtn: document.getElementById("playAgain"),
        gameOverScreen: document.getElementById("gameOver"),
        finalScore: document.getElementById("finalScore"),
        blurr: document.getElementById("blurr")
    };


    console.log(elements)
    // Initialize the game
    function initGame() {
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

    // Setup UI elements
    function setupUI() {
        updateLivesDisplay();
        elements.continueBtn.addEventListener('click', togglePause);
        elements.restartBtn.addEventListener('click', restartGame);
        elements.playAgainBtn.addEventListener('click', restartGame);
    }

    // Create alien elements in a grid
    function createAliens() {
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

    // Setup event listeners
    function setupEventListeners() {
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

    // Handle key down events
    function handleKeyDown(e) {
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

    // Handle key up events
    function handleKeyUp(e) {
        gameState.keysPressed[e.key] = false;
    }

    // Toggle game pause state
    function togglePause() {
        gameState.pause = !gameState.pause;
        elements.blurr.style.display = gameState.pause ? 'block' : 'none';
        elements.menu.style.display = gameState.pause ? 'flex' : 'none';
    }

    // Create a player shot (FIXED to shoot from center)
    function createShot() {
        let shot = document.createElement("div");
        shot.className = "shot";
        const shipCenterX = gameState.shipX + elements.ship.offsetWidth / 2;
        shot.style.left = `${shipCenterX - 1.5}px`; // Center the 3px wide shot
        shot.style.bottom = `${elements.ship.offsetHeight + 20}px`; // Start from top of ship
        elements.board.appendChild(shot);
        gameState.shots.push(shot);
    }

    // Update ship position (FIXED boundary checking)
    function updateShipPosition(deltaTime) {
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

    // Update player shots
    function updateShots(deltaTime) {
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

    // Check shot collisions with aliens
    function checkShotCollisions(shot, shotIndex) {
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

    // Update score
    function updateScore(points) {
        gameState.currentscore += points;
        elements.score.textContent = "Score: " + gameState.currentscore;
    }

    // Update time display
    function updateTime() {
        gameState.time++;
        
        let minutes = Math.floor(gameState.time / 60);
        let seconds = gameState.time % 60;
        if (seconds < 10) seconds = '0' + seconds;
        
        elements.timeDisplay.textContent = "Time: " + minutes + ':' + seconds;
    }

    // Update lives display
    function updateLivesDisplay() {
        elements.livesDisplay.textContent = `Lives: ${'❤️'.repeat(gameState.lives)}`;
    }

    // Move aliens
    function moveAliens(deltaTime) {
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

    // Alien shooting
    function alienShoot() {
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

    // Update alien shots
    function updateAlienShots(deltaTime) {
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

    // Check ship collision
    function checkShipCollision(shot) {
        const shotRect = shot.getBoundingClientRect();
        const shipRect = elements.ship.getBoundingClientRect();
        
        return (
            shotRect.left < shipRect.right &&
            shotRect.right > shipRect.left &&
            shotRect.top < shipRect.bottom &&
            shotRect.bottom > shipRect.top
        );
    }

    // Handle ship hit
    function hitShip() {
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

    // End game
    function endGame() {
        gameState.gameOver = true;
        elements.finalScore.textContent = `Final Score: ${gameState.currentscore}`;
        elements.gameOverScreen.style.display = 'flex';
    }

    // Restart game
    function restartGame() {
        // Reset game state
        gameState.lives = 3;
        gameState.currentscore = 0;
        gameState.time = 0;
        gameState.level = 1;
        gameState.gameOver = false;
        gameState.direction = 120;
        gameState.alienFireRate = 0.005;
        
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

    // Advance to next level
    function nextLevel() {
        gameState.level++;
        gameState.direction *= gameState.alienSpeedIncrease;
        gameState.alienFireRate *= 1.2;
        
        const levelUp = document.createElement('div');
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
        
        setTimeout(() => {
            levelUp.remove();
            createAliens();
        }, 2000);
    }

    // Start timers
    function startTimers() {
        setInterval(updateTime, 1000);
    }

    // Main game loop
    function update(timestamp) {
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

    // Start the game
    initGame();
};