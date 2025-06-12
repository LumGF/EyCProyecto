export class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 5;
        this.image = new Image();
        this.image.src = 'bullet.png';
    }

    update() {
        this.y -= 5;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
