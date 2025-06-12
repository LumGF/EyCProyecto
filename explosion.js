export class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.timer = 30;
        this.image = new Image();
        this.image.src = 'burst.png';
    }

    update() {
        this.timer--;
    }

    draw(ctx) {
        if (this.timer > 0) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}
