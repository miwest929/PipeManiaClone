var BoundingBox = /** @class */ (function () {
    function BoundingBox(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    BoundingBox.prototype.withinBounds = function (ptx, pty) {
        var withinX = ptx >= this.x && ptx <= (this.x + this.width);
        var withinY = pty >= this.y && pty <= (this.y + this.height);
        return withinX && withinY;
    };
    return BoundingBox;
}());
var WindowManager = /** @class */ (function () {
    function WindowManager() {
        this.components = [];
    }
    WindowManager.prototype.registerComponent = function (component, bbox) {
        var compBb = { component: component, bbox: bbox };
        this.components.push(compBb);
    };
    WindowManager.prototype.render = function (ctx, x, y) {
        this.components.forEach(function (cbb) {
            var bb = cbb.bbox;
            cbb.component.render(ctx, bb.x, bb.y);
        });
    };
    WindowManager.prototype.mouseMove = function (x, y) {
        var cbb = this.getInBoundsComponent(x, y);
        if (cbb) {
            cbb.component.mouseMove(x - cbb.bbox.x, y - cbb.bbox.y);
        }
    };
    WindowManager.prototype.mouseClick = function (x, y) {
        var cbb = this.getInBoundsComponent(x, y);
        if (cbb) {
            cbb.component.mouseClick(x - cbb.bbox.x, y - cbb.bbox.y);
        }
    };
    WindowManager.prototype.getInBoundsComponent = function (x, y) {
        var c = null;
        this.components.forEach(function (cbb) {
            if (cbb.bbox.withinBounds(x, y)) {
                c = cbb;
            }
        });
        return c;
    };
    return WindowManager;
}());
var PipeGridComponent = /** @class */ (function () {
    function PipeGridComponent(pipeGrid) {
        this.pipeGrid = pipeGrid;
    }
    PipeGridComponent.prototype.render = function (ctx, x, y) {
    };
    PipeGridComponent.prototype.mouseMove = function (x, y) {
        this.pipeGrid.mouseMove(x, y);
    };
    PipeGridComponent.prototype.mouseClick = function (x, y) {
        this.pipeGrid.mouseClick(x, y);
    };
    return PipeGridComponent;
}());
var NextTileComponent = /** @class */ (function () {
    function NextTileComponent(width, height) {
        var _this = this;
        this.width = width;
        this.height = height;
        this.nextTileId = this.getRandomTileId();
        this.timeLeftSecs = 30;
        this.countdownTimer = setInterval(function () { _this.timeLeftSecs -= 1; }, 1000);
    }
    NextTileComponent.prototype.consumeNextTileId = function () {
        var tileId = this.nextTileId;
        this.nextTileId = this.getRandomTileId();
        return tileId;
    };
    NextTileComponent.prototype.mouseMove = function (x, y) {
    };
    NextTileComponent.prototype.mouseClick = function (x, y) {
    };
    NextTileComponent.prototype.render = function (ctx, x, y) {
        ctx.strokeStyle = "rgb(100,100,100)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.rect(x, y, this.width, this.height);
        ctx.stroke();
        this.renderNextTileView(ctx, x, y);
        this.renderTimerView(ctx, x, y);
    };
    NextTileComponent.prototype.renderNextTileView = function (ctx, x, y) {
        ctx.font = "20px verdana";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("NEXT", x + 10, y + 40);
        tiles[this.nextTileId].renderAt(ctx, x + (this.width / 4), y + 50, 32, 32);
    };
    NextTileComponent.prototype.renderTimerView = function (ctx, x, y) {
        ctx.font = "20px verdana";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("TIME", x + 10, y + 120);
        ctx.font = "20px verdana";
        ctx.fillStyle = "rgb(200, 200, 200)";
        ctx.fillText(this.timeLeftSecs.toString(), x + 10, y + 150);
    };
    NextTileComponent.prototype.getRandomTileId = function () {
        return Math.floor(Math.random() * 6);
    };
    return NextTileComponent;
}());
