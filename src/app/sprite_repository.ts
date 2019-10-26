class Sprite {
  image: HTMLImageElement;
  loaded: boolean;

  constructor() {
    this.loaded = false;
    this.image = this.createImageObject();
  }

  createImageObject() {
    let img = new Image();
    img.onload = () => {
      this.loaded = true;
    };
    img.onerror = () => {
      console.log(`Failed to load '${img.src}'`);
      this.loaded = true;
    };

    return img;
  }
}

class SpriteRepository {
  sprites: Sprite[] = [];

  constructor(spritePaths) {  
    spritePaths.forEach((path) => {
      let spriteKey = this.extractName(path);
      this.sprites[spriteKey] = new Sprite();
      this.sprites[spriteKey].image.src = path;
    });
  }

  fetch(key) {
    return this.sprites[key];
  }

  extractName(path) {
    if (path[0] === '.' )
      path = path.slice(1);

    return ( path.split('.')[0].split('/').pop() );
  }
}

class Tile {
  sprite: Sprite;
  startX: number;
  startY: number;
  tileWidth: number;
  tileHeight: number;

  constructor(sprite, startX, startY, tileWidth, tileHeight) {
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
  renderAt(context, x, y, renderedWidth, renderedHeight) {
    // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    // sWidth, sHeight -> width, height of sub-rectangle in source image
    context.drawImage(
      this.sprite,
      this.startX,
      this.startY,
      this.tileWidth,
      this.tileHeight,
      x,
      y,
      renderedWidth,
      renderedHeight,
    );
  }
}

class Frame {
  tiles: Tile[];
  renderFn: (a: Tile[], b: CanvasRenderingContext2D, x: number, y: number) => void;

  constructor(tiles, renderFn) {
    this.tiles = tiles;
    this.renderFn = renderFn;
  }

  render(context, x, y) {
    this.renderFn(this.tiles, context, x, y);
  }
}

let createAnimation = (tiles, renderFn, onEachFn) => {
  let frames = [];
  for (let i = 0; i < tiles.length; i++) {
    let frameTiles = tiles[i];
    if (!Array.isArray(frameTiles)) {
      frameTiles = [frameTiles];
    }
    frames.push(new Frame(frameTiles, renderFn));
  }
  let animation = new SpriteAnimation(frames);
  if (onEachFn) {
    animation.onEach = onEachFn;
  }

  return animation;
}

class SpriteAnimation {
  frames: Array<Frame>;
  currentFrameIndex: number;
  currentTimer: number;
  onFinished: () => void;
  onEach: () => void;

  constructor(frames) {
    this.frames = frames;
    this.currentFrameIndex = 0;
    this.currentTimer = null;
    this.onFinished = () => {};
    this.onEach = () => {};
  }

  inProgress() {
    return !!this.currentTimer
  }

  playLoop(speed) {
    this.currentFrameIndex = 0;
    this.currentTimer = setInterval(() => {
      this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
      this.onEach();
    }, speed);
  }

  play(speed) {
    this.currentFrameIndex = 0;
    this.currentTimer = setInterval(() => {
      this.currentFrameIndex += 1;

      if (this.currentFrameIndex < this.frames.length) {
        this.onEach();
      } else {
        this.onEach();
        this.onFinished();
        this.currentFrameIndex = 0;
        this.stop();
      }
    }, speed);
  }

  stop() {
    if (this.currentTimer) {
      window.clearInterval(this.currentTimer);
      this.currentTimer = null;
    }
  }

  render(context, x, y) {
    this.frames[this.currentFrameIndex].render(context, x, y);
  }
}
