let TILE_DIM:number = 26;
let spritesRepo:SpriteRepository = new SpriteRepository([
  imgUrl('sprites.png'),
  imgUrl('RotateClockwise.png'),
  imgUrl('RotateCounterClockwise.png'),
  imgUrl('FastForward.png')
]);
let spritesImg:HTMLImageElement = spritesRepo.fetch('sprites').image;

let vertical:Tile = new Tile(spritesImg, 2, 164, TILE_DIM, TILE_DIM);
let horizontal:Tile = new Tile(spritesImg, 2, 191, TILE_DIM, TILE_DIM);
let cross:Tile = new Tile(spritesImg, 29, 191, TILE_DIM, TILE_DIM);
let bottomRightTurn:Tile = new Tile(spritesImg, 56, 164, TILE_DIM, TILE_DIM);
let bottomLeftTurn:Tile = new Tile(spritesImg, 83, 164, TILE_DIM, TILE_DIM);
let topRightTurn:Tile = new Tile(spritesImg, 56, 191, TILE_DIM, TILE_DIM);
let topLeftTurn:Tile = new Tile(spritesImg, 83, 191, TILE_DIM, TILE_DIM);
let topStart:Tile = new Tile(spritesImg, 29, 164, TILE_DIM, TILE_DIM);
let rightStart:Tile = new Tile(spritesImg, 110, 191, TILE_DIM, TILE_DIM);
let bottomStart:Tile = new Tile(spritesImg, 137, 191, TILE_DIM, TILE_DIM);
let leftStart:Tile = new Tile(spritesImg, 164, 191, TILE_DIM, TILE_DIM);
let topEnd:Tile = new Tile(spritesImg, 110, 164, TILE_DIM, TILE_DIM);
let rightEnd:Tile = new Tile(spritesImg, 138, 164, TILE_DIM, TILE_DIM);
let bottomEnd:Tile = new Tile(spritesImg, 164, 164, TILE_DIM, TILE_DIM);
let leftEnd:Tile = new Tile(spritesImg, 191, 164, TILE_DIM, TILE_DIM);
let blank:Tile = new Tile(spritesImg, 191, 191, TILE_DIM, TILE_DIM);
let indestructible:Tile = new Tile(spritesImg, 29, 110, TILE_DIM, TILE_DIM);

let rotateClockwiseImg:HTMLImageElement = spritesRepo.fetch('RotateClockwise').image;
let rotateCounterClockwiseImg:HTMLImageElement = spritesRepo.fetch('RotateCounterClockwise').image;
let fastForwardImg:HTMLImageElement = spritesRepo.fetch('FastForward').image;

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