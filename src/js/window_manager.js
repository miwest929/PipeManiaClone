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
    WindowManager.prototype.registerComponent = function (component, bbox, zIndex) {
        var compBb = { component: component, bbox: bbox, zIndex: zIndex };
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
        var currZ = 1000000.0;
        this.components.forEach(function (rc) {
            if (rc.bbox.withinBounds(x, y) && rc.zIndex < currZ) {
                c = rc;
                currZ = rc.zIndex;
            }
        });
        return c;
    };
    return WindowManager;
}());
