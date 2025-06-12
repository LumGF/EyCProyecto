import { Player } from './player.js';
import { Bullet } from './bullet.js';
import { CollisionManager } from './collisionManager.js';

export class GameManager {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.score = 0;
        this.lives = 5;
        this.level = 1;
        this.objectSpeed = 2;
        this.spawnRate = 60;
        this.player = new Player(canvas.width / 2 - 16, canvas.height - 42);
        this.Bullet = Bullet;
        this.bullets = [];
        this.fallingObjects = [];
        this.explosions = [];
    }

    reset() {
        this.score = 0;
        this.lives = 5;
        this.level = 1;
        this.objectSpeed = 2;
        this.spawnRate = 60;
        this.bullets = [];
        this.fallingObjects = [];
        this.explosions = [];
        this.player.x = this.canvas.width / 2 - 16;
        this.player.y = this.canvas.height - 42;
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
    }

    updateScore() {
        this.score += 10;
        document.getElementById('score').textContent = this.score;
        this.updateLevel();
    }

    updateLevel() {
        if (this.level === 1 && this.score >= 50) this.levelUp(2, 4, 50);
        else if (this.level === 2 && this.score >= 100) this.levelUp(3, 6, 40);
        else if (this.level === 3 && this.score >= 150) this.showCongrats();
        document.getElementById('level').textContent = this.level;
    }

    levelUp(newLevel, newSpeed, newSpawnRate) {
        this.level = newLevel;
        this.objectSpeed = newSpeed;
        this.spawnRate = newSpawnRate;
        document.getElementById('nextLevel').textContent = newLevel;
        document.getElementById('levelUpScreen').classList.remove('hidden');
    }

    showCongrats() {
        document.getElementById('gameScreen').classList.add('hidden');
        document.getElementById('congratsScreen').classList.remove('hidden');
    }

    checkCollision(a, b) {
        return CollisionManager.isColliding(a, b);
    }
}
