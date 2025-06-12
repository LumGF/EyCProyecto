import { GameManager } from './gameManager.js';
import { InputManager } from './inputManager.js';
import { gameLoop } from './gameLoop.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const game = new GameManager(canvas, ctx);
new InputManager(game.player, game);

// Botones UI
startButton.addEventListener('click', () => {
    mainMenu.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    game.reset();
    gameLoop(game, ctx, canvas);
});

retryButton.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    game.reset();
    gameLoop(game, ctx, canvas);
});

restartButton.addEventListener('click', () => {
    congratsScreen.classList.add('hidden');
    mainMenu.classList.remove('hidden');
});

continueButton.addEventListener('click', () => {
    levelUpScreen.classList.add('hidden');
    gameLoop(game, ctx, canvas);
});
