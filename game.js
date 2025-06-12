// Elementos de la interfaz
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const mainMenu = document.getElementById('mainMenu');
const gameScreen = document.getElementById('gameScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const congratsScreen = document.getElementById('congratsScreen');
const levelUpScreen = document.getElementById('levelUpScreen');
const startButton = document.getElementById('startButton');
const retryButton = document.getElementById('retryButton');
const restartButton = document.getElementById('restartButton');
const continueButton = document.getElementById('continueButton');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const levelDisplay = document.getElementById('level');
const finalScoreDisplay = document.getElementById('finalScore');
const nextLevelDisplay = document.getElementById('nextLevel');

// Constantes del juego
const playerSize = 32;
const rockSize = 24;
const bulletSize = 5;
const explosionSize = 32;
let objectSpeed = 2;
let spawnRate = 60;
const playerSpeed = 5;
const bulletSpeed = 5;

// Imágenes
const backgroundImage = new Image();
backgroundImage.src = 'background.jpg';
const playerImage = new Image();
playerImage.src = 'player.png';
const rockImage = new Image();
rockImage.src = 'rock.png';
const bulletImage = new Image();
bulletImage.src = 'bullet.png';
const explosionImage = new Image();
explosionImage.src = 'burst.png';

// Sonidos
const shootSound = new Audio('shoot.mp3');
const explosionSound = new Audio('explosion.mp3');
const hitSound = new Audio('hit.mp3');

// Clase base
class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    update() {}
    draw() {}
}

// Jugador
class Player extends GameObject {
    constructor() {
        super(canvas.width / 2 - playerSize / 2, canvas.height - playerSize - 10, playerSize, playerSize);
        this.moving = { left: false, right: false, up: false, down: false };
    }
    draw() {
        ctx.drawImage(playerImage, this.x, this.y, this.width, this.height);
    }
    update() {
        if (this.moving.left && this.x > 0) this.x -= playerSpeed;
        if (this.moving.right && this.x < canvas.width - this.width) this.x += playerSpeed;
        if (this.moving.up && this.y > 0) this.y -= playerSpeed;
        if (this.moving.down && this.y < canvas.height - this.height) this.y += playerSpeed;
    }
    shoot() {
        return new Bullet(this.x + this.width / 2 - bulletSize / 2, this.y);
    }
}

// Bala
class Bullet extends GameObject {
    constructor(x, y) {
        super(x, y, bulletSize, bulletSize);
    }
    update() {
        this.y -= bulletSpeed;
    }
    draw() {
        ctx.drawImage(bulletImage, this.x, this.y, this.width, this.height);
    }
}

// Roca
class FallingObject extends GameObject {
    constructor() {
        super(Math.random() * (canvas.width - rockSize), 0, rockSize, rockSize);
    }
    draw() {
        ctx.drawImage(rockImage, this.x, this.y, this.width, this.height);
    }
    update() {
        this.y += objectSpeed;
    }
}

// Explosión
class Explosion extends GameObject {
    constructor(x, y) {
        super(x, y, explosionSize, explosionSize);
        this.timer = 30;
    }
    update() {
        this.timer--;
    }
    draw() {
        if (this.timer > 0) {
            ctx.drawImage(explosionImage, this.x, this.y, this.width, this.height);
        }
    }
}

// Gestor del juego
class GameManager {
    constructor() {
        this.score = 0;
        this.lives = 5;
        this.level = 1;
        this.player = new Player();
        this.fallingObjects = [];
        this.bullets = [];
        this.explosions = [];
    }
    reset() {
        this.score = 0;
        this.lives = 5;
        this.level = 1;
        objectSpeed = 2;
        spawnRate = 60;
        this.fallingObjects = [];
        this.bullets = [];
        this.explosions = [];
        this.player = new Player();
        scoreDisplay.textContent = this.score;
        livesDisplay.textContent = this.lives;
        levelDisplay.textContent = this.level;
    }
    updateScore() {
        this.score += 10;
        scoreDisplay.textContent = this.score;
        this.updateLevel();
    }
    updateLevel() {
        if (this.level === 1 && this.score >= 50) this.levelUp(2, 4, 50);
        else if (this.level === 2 && this.score >= 100) this.levelUp(3, 6, 40);
        else if (this.level === 3 && this.score >= 150) this.showCongrats();
        levelDisplay.textContent = this.level;
    }
    levelUp(newLevel, newSpeed, newSpawnRate) {
        this.level = newLevel;
        objectSpeed = newSpeed;
        spawnRate = newSpawnRate;
        showLevelUpScreen(newLevel);
    }
    showCongrats() {
        gameScreen.classList.add('hidden');
        congratsScreen.classList.remove('hidden');
    }
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
}

function showLevelUpScreen(nextLevel) {
    nextLevelDisplay.textContent = nextLevel;
    levelUpScreen.classList.remove('hidden');
}

// Instancia global del juego
const game = new GameManager();

// Función para iniciar el loop del juego
function startGameLoop() {
    window.currentAnimation = requestAnimationFrame(gameLoop);
}

// Pausar y reanudar
function pausarJuego() {
    cancelAnimationFrame(window.currentAnimation);
}

function reanudarJuego() {
    startGameLoop();
}

// Loop principal
function gameLoop() {
    if (levelUpScreen.classList.contains('hidden')) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        game.player.update();
        game.player.draw();

        if (Math.random() < 1 / spawnRate) {
            game.fallingObjects.push(new FallingObject());
        }

        for (let i = game.bullets.length - 1; i >= 0; i--) {
            const bullet = game.bullets[i];
            bullet.update();
            bullet.draw();

            if (bullet.y < 0) {
                game.bullets.splice(i, 1);
                continue;
            }

            for (let j = game.fallingObjects.length - 1; j >= 0; j--) {
                const rock = game.fallingObjects[j];
                if (game.checkCollision(bullet, rock)) {
                    game.explosions.push(new Explosion(rock.x, rock.y));
                    explosionSound.play();
                    game.fallingObjects.splice(j, 1);
                    game.bullets.splice(i, 1);
                    game.updateScore();
                    break;
                }
            }
        }

        for (let i = game.fallingObjects.length - 1; i >= 0; i--) {
            const obj = game.fallingObjects[i];
            obj.update();
            obj.draw();

            if (game.checkCollision(game.player, obj)) {
                game.lives--;
                livesDisplay.textContent = game.lives;
                hitSound.play();
                game.fallingObjects.splice(i, 1);
                if (game.lives === 0) {
                    game.explosions.push(new Explosion(game.player.x, game.player.y));
                    finalScoreDisplay.textContent = game.score;
                    gameScreen.classList.add('hidden');
                    gameOverScreen.classList.remove('hidden');
                    return;
                }
            }

            if (obj.y > canvas.height) {
                game.fallingObjects.splice(i, 1);
            }
        }

        for (let i = game.explosions.length - 1; i >= 0; i--) {
            const explosion = game.explosions[i];
            explosion.update();
            explosion.draw();
            if (explosion.timer <= 0) {
                game.explosions.splice(i, 1);
            }
        }

        window.currentAnimation = requestAnimationFrame(gameLoop);
    }
}

// Botones
startButton.addEventListener('click', () => {
    mainMenu.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    game.reset();
    startGameLoop();
});

retryButton.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    game.reset();
    startGameLoop();
});

restartButton.addEventListener('click', () => {
    congratsScreen.classList.add('hidden');
    mainMenu.classList.remove('hidden');
});

continueButton.addEventListener('click', () => {
    levelUpScreen.classList.add('hidden');
    startGameLoop();
});

// Movimiento del jugador
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') game.player.moving.left = true;
    if (e.key === 'ArrowRight') game.player.moving.right = true;
    if (e.key === 'ArrowUp') game.player.moving.up = true;
    if (e.key === 'ArrowDown') game.player.moving.down = true;
    if (e.key === ' ') {
        game.bullets.push(game.player.shoot());
        shootSound.currentTime = 0;
        shootSound.play();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') game.player.moving.left = false;
    if (e.key === 'ArrowRight') game.player.moving.right = false;
    if (e.key === 'ArrowUp') game.player.moving.up = false;
    if (e.key === 'ArrowDown') game.player.moving.down = false;
});