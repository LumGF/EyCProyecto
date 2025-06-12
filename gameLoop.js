import { FallingObject } from './fallingObject.js';
import { Explosion } from './explosion.js';

const explosionSound = new Audio('explosion.mp3');
const hitSound = new Audio('hit.mp3');
const backgroundImage = new Image();
backgroundImage.src = 'background.jpg';

export function gameLoop(game, ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    game.player.update(canvas);
    game.player.draw(ctx);

    if (Math.random() < 1 / game.spawnRate) {
        game.fallingObjects.push(new FallingObject(canvas.width));
    }

    for (let i = game.bullets.length - 1; i >= 0; i--) {
        const bullet = game.bullets[i];
        bullet.update();
        bullet.draw(ctx);

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
        obj.update(game.objectSpeed);
        obj.draw(ctx);

        if (game.checkCollision(game.player, obj)) {
            game.lives--;
            document.getElementById('lives').textContent = game.lives;
            hitSound.play();
            game.fallingObjects.splice(i, 1);
            if (game.lives === 0) {
                game.explosions.push(new Explosion(game.player.x, game.player.y));
                document.getElementById('finalScore').textContent = game.score;
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
        explosion.draw(ctx);
        if (explosion.timer <= 0) {
            game.explosions.splice(i, 1);
        }
    }

    window.currentAnimation = requestAnimationFrame(() => gameLoop(game, ctx, canvas));
}
