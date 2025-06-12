export class InputManager {
    constructor(player, game) {
        this.player = player;
        this.game = game;
        this.shootSound = new Audio('shoot.mp3');
        this.init();
    }

    init() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.player.moving.left = true;
            if (e.key === 'ArrowRight') this.player.moving.right = true;
            if (e.key === 'ArrowUp') this.player.moving.up = true;
            if (e.key === 'ArrowDown') this.player.moving.down = true;
            if (e.key === ' ') {
                this.game.bullets.push(this.player.shoot(this.game.Bullet));
                this.shootSound.currentTime = 0;
                this.shootSound.play();
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft') this.player.moving.left = false;
            if (e.key === 'ArrowRight') this.player.moving.right = false;
            if (e.key === 'ArrowUp') this.player.moving.up = false;
            if (e.key === 'ArrowDown') this.player.moving.down = false;
        });
    }
}
