var TILE_DIM = 26;
var spritesRepo = new SpriteRepository([
    './src/img/sprites.png'
]);
var spritesImg = spritesRepo.fetch('sprites').image;
var vertical = new Tile(spritesImg, 2, 164, TILE_DIM, TILE_DIM);
var horizontal = new Tile(spritesImg, 2, 191, TILE_DIM, TILE_DIM);
var cross = new Tile(spritesImg, 29, 191, TILE_DIM, TILE_DIM);
var bottomRightTurn = new Tile(spritesImg, 56, 164, TILE_DIM, TILE_DIM);
var bottomLeftTurn = new Tile(spritesImg, 83, 164, TILE_DIM, TILE_DIM);
var topRightTurn = new Tile(spritesImg, 56, 191, TILE_DIM, TILE_DIM);
var topLeftTurn = new Tile(spritesImg, 83, 191, TILE_DIM, TILE_DIM);
var topStart = new Tile(spritesImg, 29, 164, TILE_DIM, TILE_DIM);
var rightStart = new Tile(spritesImg, 110, 191, TILE_DIM, TILE_DIM);
var bottomStart = new Tile(spritesImg, 137, 191, TILE_DIM, TILE_DIM);
var leftStart = new Tile(spritesImg, 164, 191, TILE_DIM, TILE_DIM);
var topEnd = new Tile(spritesImg, 110, 164, TILE_DIM, TILE_DIM);
var rightEnd = new Tile(spritesImg, 138, 164, TILE_DIM, TILE_DIM);
var bottomEnd = new Tile(spritesImg, 164, 164, TILE_DIM, TILE_DIM);
var leftEnd = new Tile(spritesImg, 191, 164, TILE_DIM, TILE_DIM);
var blank = new Tile(spritesImg, 191, 191, TILE_DIM, TILE_DIM);
var indestructible = new Tile(spritesImg, 29, 110, TILE_DIM, TILE_DIM);
function isNonReplacableTile(tileId) {
    return tileId >= 7 && tileId <= 14 || tileId == Tiles.Indestructible;
}
var Tiles;
(function (Tiles) {
    Tiles[Tiles["Vertical"] = 0] = "Vertical";
    Tiles[Tiles["Horizontal"] = 1] = "Horizontal";
    Tiles[Tiles["Cross"] = 2] = "Cross";
    Tiles[Tiles["BottomRightTurn"] = 3] = "BottomRightTurn";
    Tiles[Tiles["BottomLeftTurn"] = 4] = "BottomLeftTurn";
    Tiles[Tiles["TopRightTurn"] = 5] = "TopRightTurn";
    Tiles[Tiles["TopLeftTurn"] = 6] = "TopLeftTurn";
    Tiles[Tiles["TopStart"] = 7] = "TopStart";
    Tiles[Tiles["BottomStart"] = 8] = "BottomStart";
    Tiles[Tiles["RightStart"] = 9] = "RightStart";
    Tiles[Tiles["LeftStart"] = 10] = "LeftStart";
    Tiles[Tiles["TopEnd"] = 11] = "TopEnd";
    Tiles[Tiles["RightEnd"] = 12] = "RightEnd";
    Tiles[Tiles["BottomEnd"] = 13] = "BottomEnd";
    Tiles[Tiles["LeftEnd"] = 14] = "LeftEnd";
    Tiles[Tiles["Blank"] = 15] = "Blank";
    Tiles[Tiles["CrossVertical"] = 16] = "CrossVertical";
    Tiles[Tiles["CrossHorizontal"] = 17] = "CrossHorizontal";
    Tiles[Tiles["Indestructible"] = 18] = "Indestructible";
})(Tiles || (Tiles = {}));
;
var tiles = [
    vertical, horizontal, cross, bottomRightTurn,
    bottomLeftTurn, topRightTurn, topLeftTurn,
    topStart, bottomStart, rightStart, leftStart,
    topEnd, rightEnd, bottomEnd, leftEnd, blank,
    cross, cross, indestructible
];
