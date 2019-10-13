var Sprite = /** @class */ (function () {
    function Sprite() {
        this.loaded = false;
        this.image = this.createImageObject();
    }
    Sprite.prototype.createImageObject = function () {
        var _this = this;
        var img = new Image();
        img.onload = function () {
            _this.loaded = true;
        };
        img.onerror = function () {
            console.log("Failed to load '" + img.src + "'");
            _this.loaded = true;
        };
        return img;
    };
    return Sprite;
}());
var SpriteRepository = /** @class */ (function () {
    function SpriteRepository(spritePaths) {
        var _this = this;
        this.sprites = [];
        spritePaths.forEach(function (path) {
            var spriteKey = _this.extractName(path);
            _this.sprites[spriteKey] = new Sprite();
            _this.sprites[spriteKey].image.src = path;
        });
    }
    SpriteRepository.prototype.fetch = function (key) {
        return this.sprites[key];
    };
    SpriteRepository.prototype.extractName = function (path) {
        if (path[0] === '.')
            path = path.slice(1);
        return (path.split('.')[0].split('/').pop());
    };
    return SpriteRepository;
}());
var Tile = /** @class */ (function () {
    function Tile(sprite, startX, startY, tileWidth, tileHeight) {
        this.sprite = sprite;
        this.startX = startX;
        this.startY = startY;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }
    // renderedWidth -> width on destination canvas
    // renderedHeight -> height on destination canvas
    // this.tileWidth -> width in source image
    // this.tileHeight -> height in source image
    Tile.prototype.renderAt = function (context, x, y, renderedWidth, renderedHeight) {
        // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        // sWidth, sHeight -> width, height of sub-rectangle in source image
        context.drawImage(this.sprite, this.startX, this.startY, this.tileWidth, this.tileHeight, x, y, renderedWidth, renderedHeight);
    };
    return Tile;
}());
var Frame = /** @class */ (function () {
    function Frame(tiles, renderFn) {
        this.tiles = tiles;
        this.renderFn = renderFn;
    }
    Frame.prototype.render = function (context, x, y) {
        this.renderFn(this.tiles, context, x, y);
    };
    return Frame;
}());
var createAnimation = function (tiles, renderFn, onEachFn) {
    var frames = [];
    for (var i = 0; i < tiles.length; i++) {
        var frameTiles = tiles[i];
        if (!Array.isArray(frameTiles)) {
            frameTiles = [frameTiles];
        }
        frames.push(new Frame(frameTiles, renderFn));
    }
    var animation = new SpriteAnimation(frames);
    if (onEachFn) {
        animation.onEach = onEachFn;
    }
    return animation;
};
var SpriteAnimation = /** @class */ (function () {
    function SpriteAnimation(frames) {
        this.frames = frames;
        this.currentFrameIndex = 0;
        this.currentTimer = null;
        this.onFinished = function () { };
        this.onEach = function () { };
    }
    SpriteAnimation.prototype.inProgress = function () {
        return !!this.currentTimer;
    };
    SpriteAnimation.prototype.playLoop = function (speed) {
        var _this = this;
        this.currentFrameIndex = 0;
        this.currentTimer = setInterval(function () {
            _this.currentFrameIndex = (_this.currentFrameIndex + 1) % _this.frames.length;
            _this.onEach();
        }, speed);
    };
    SpriteAnimation.prototype.play = function (speed) {
        var _this = this;
        this.currentFrameIndex = 0;
        this.currentTimer = setInterval(function () {
            _this.currentFrameIndex += 1;
            if (_this.currentFrameIndex < _this.frames.length) {
                _this.onEach();
            }
            else {
                _this.onEach();
                _this.onFinished();
                _this.currentFrameIndex = 0;
                _this.stop();
            }
        }, speed);
    };
    SpriteAnimation.prototype.stop = function () {
        if (this.currentTimer) {
            window.clearInterval(this.currentTimer);
            this.currentTimer = null;
        }
    };
    SpriteAnimation.prototype.render = function (context, x, y) {
        this.frames[this.currentFrameIndex].render(context, x, y);
    };
    return SpriteAnimation;
}());
