const TILE_DIM:number = 26;
const spritesRepo:SpriteRepository = new SpriteRepository([
  imgUrl('sprites.png'),
  imgUrl('RotateClockwise.png'),
  imgUrl('RotateCounterClockwise.png'),
  imgUrl('FastForward.png')
]);
const spritesImg:HTMLImageElement = spritesRepo.fetch('sprites').image;

const vertical:Tile = new Tile(spritesImg, 2, 164, TILE_DIM, TILE_DIM);
const horizontal:Tile = new Tile(spritesImg, 2, 191, TILE_DIM, TILE_DIM);
const cross:Tile = new Tile(spritesImg, 29, 191, TILE_DIM, TILE_DIM);
const bottomRightTurn:Tile = new Tile(spritesImg, 56, 164, TILE_DIM, TILE_DIM);
const bottomLeftTurn:Tile = new Tile(spritesImg, 83, 164, TILE_DIM, TILE_DIM);
const topRightTurn:Tile = new Tile(spritesImg, 56, 191, TILE_DIM, TILE_DIM);
const topLeftTurn:Tile = new Tile(spritesImg, 83, 191, TILE_DIM, TILE_DIM);
const topStart:Tile = new Tile(spritesImg, 29, 164, TILE_DIM, TILE_DIM);
const rightStart:Tile = new Tile(spritesImg, 110, 191, TILE_DIM, TILE_DIM);
const bottomStart:Tile = new Tile(spritesImg, 137, 191, TILE_DIM, TILE_DIM);
const leftStart:Tile = new Tile(spritesImg, 164, 191, TILE_DIM, TILE_DIM);
const topEnd:Tile = new Tile(spritesImg, 110, 164, TILE_DIM, TILE_DIM);
const rightEnd:Tile = new Tile(spritesImg, 138, 164, TILE_DIM, TILE_DIM);
const bottomEnd:Tile = new Tile(spritesImg, 164, 164, TILE_DIM, TILE_DIM);
const leftEnd:Tile = new Tile(spritesImg, 191, 164, TILE_DIM, TILE_DIM);
const blank:Tile = new Tile(spritesImg, 191, 191, TILE_DIM, TILE_DIM);
const indestructible:Tile = new Tile(spritesImg, 29, 110, TILE_DIM, TILE_DIM);

const rotateClockwiseImg:HTMLImageElement = spritesRepo.fetch('RotateClockwise').image;
const rotateClockwiseBtn = Tile.createFrom(rotateClockwiseImg);

const rotateCounterClockwiseImg:HTMLImageElement = spritesRepo.fetch('RotateCounterClockwise').image;
const rotateCounterClockwiseBtn = Tile.createFrom(rotateCounterClockwiseImg);

const fastForwardImg:HTMLImageElement = spritesRepo.fetch('FastForward').image;
const fastForwardBtn = Tile.createFrom(fastForwardImg);

function imgUrl(filename: string) {
  return `./src/img/${filename}`;
}

function isNonReplacableTile(tileId: number): boolean {
    return tileId >= 7 && tileId <= 14 || tileId == Tiles.Indestructible;
}

enum Tiles {
  Vertical = 0,
  Horizontal,
  Cross,
  BottomRightTurn,
  BottomLeftTurn,
  TopRightTurn,
  TopLeftTurn,
  TopStart,
  BottomStart,
  RightStart,
  LeftStart,
  TopEnd,
  RightEnd,
  BottomEnd,
  LeftEnd,
  Blank, // should always be last,
  CrossVertical,
  CrossHorizontal,
  Indestructible
};
const tiles:Tile[] = [
  vertical, horizontal, cross, bottomRightTurn,
  bottomLeftTurn, topRightTurn, topLeftTurn,
  topStart, bottomStart, rightStart, leftStart,
  topEnd, rightEnd, bottomEnd, leftEnd, blank,
  cross, cross, indestructible
];