var WindowManager = /** @class */ (function () {
    function WindowManager() {
        this.components = [];
    }
    WindowManager.prototype.registerComponent = function (component) {
        this.components.push(component);
    };
    WindowManager.prototype.render = function (ctx, x, y) {
        this.components.forEach(function (c) {
            c.render(ctx, x, y);
        });
    };
    return WindowManager;
}());
var NextTileComponent = /** @class */ (function () {
    function NextTileComponent() {
        this.nextTileId = this.getRandomTileId();
    }
    NextTileComponent.prototype.render = function (ctx, x, y) {
        var WIDTH = 80;
        var HEIGHT = 100;
        ctx.strokeStyle = "rgb(100,100,100)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.rect(x, y, WIDTH, HEIGHT);
        ctx.stroke();
        ctx.font = "20px verdana";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("NEXT", x + 10, y + 40);
        tiles[this.nextTileId].renderAt(ctx, x + (WIDTH / 4), y + (HEIGHT / 2), 32, 32);
    };
    NextTileComponent.prototype.getRandomTileId = function () {
        return Math.floor(Math.random() * 6);
    };
    return NextTileComponent;
}());
