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
        console.log("MouseMove: " + x + ", " + y);
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
var NEXT_TILE_CNT = 8;
var NextTileComponent = /** @class */ (function () {
    function NextTileComponent(width, height) {
        var _this = this;
        this.width = width;
        this.height = height;
        this.nextTileIds = Array(NEXT_TILE_CNT).fill(0).map(function () { return _this.getRandomTileId(); });
    }
    NextTileComponent.prototype.consumeNextTileId = function () {
        var tileId = this.nextTileIds.shift();
        this.nextTileIds.push(this.getRandomTileId());
        return tileId;
    };
    NextTileComponent.prototype.mouseMove = function (x, y) {
    };
    NextTileComponent.prototype.mouseClick = function (x, y) {
    };
    NextTileComponent.prototype.render = function (ctx, x, y) {
        this.renderBorder(ctx, x, y);
        ctx.font = "20px verdana";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("NEXT", x + 10, y + 40);
        this.renderImmediateNextTile(ctx, x, y);
        this.renderRemainingNextTiles(ctx, x, y);
    };
    NextTileComponent.prototype.renderImmediateNextTile = function (ctx, x, y) {
        tiles[0].renderAt(ctx, x + (this.width / 4) - 8, y + 50, 64, 64);
        // // render border around the very next tile
        // ctx.strokeStyle = "rgb(256, 256, 256)";
        // ctx.lineWidth = 2;
        // ctx.beginPath();
        // ctx.rect(x+(this.width/4)-10, y+48, 68, 68);
        // ctx.stroke();
    };
    NextTileComponent.prototype.renderBorder = function (ctx, x, y) {
        ctx.strokeStyle = "rgb(100,100,100)";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.rect(x, y, this.width, this.height);
        ctx.stroke();
    };
    NextTileComponent.prototype.renderRemainingNextTiles = function (ctx, x, y) {
        var _this = this;
        var nextY = 150;
        this.nextTileIds.slice(1).forEach(function (tileId) {
            tiles[tileId].renderAt(ctx, x + (_this.width / 4) - 8, y + nextY, 48, 48);
            nextY += 60;
        });
    };
    NextTileComponent.prototype.getRandomTileId = function () {
        return Math.floor(Math.random() * 7);
    };
    return NextTileComponent;
}());
