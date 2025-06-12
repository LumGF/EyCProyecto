export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.speed = 5;
        this.image = new Image();
        this.image.src = 'player.png';
        this.moving = { left: false, right: false, up: false, down: false };
    }

    update(canvas) {
        if (this.moving.left && this.x > 0) this.x -= this.speed;
        if (this.moving.right && this.x < canvas.width - this.width) this.x += this.speed;
        if (this.moving.up && this.y > 0) this.y -= this.speed;
        if (this.moving.down && this.y < canvas.height - this.height) this.y += this.speed;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    shoot(Bullet) {
        return new Bullet(this.x + this.width / 2 - 2.5, this.y);
    }
}
