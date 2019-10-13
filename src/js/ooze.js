var WEST = "WEST";
var EAST = "EAST";
var SOUTH = "SOUTH";
var NORTH = "NORTH";
var tileMovements = {};
tileMovements[Tiles.Horizontal] = { "WEST": "WEST", "EAST": "EAST", "DEFAULT": "WEST" };
tileMovements[Tiles.BottomLeftTurn] = { "EAST": "SOUTH", "NORTH": "WEST", "DEFAULT": "EAST" };
tileMovements[Tiles.BottomRightTurn] = { "WEST": "SOUTH", "NORTH": "EAST", "DEFAULT": "WEST" };
tileMovements[Tiles.TopRightTurn] = { "SOUTH": "EAST", "WEST": "NORTH", "DEFAULT": "EAST" };
tileMovements[Tiles.TopLeftTurn] = { "SOUTH": "WEST", "EAST": "NORTH", "DEFAULT": "EAST" };
tileMovements[Tiles.Vertical] = { "SOUTH": "SOUTH", "NORTH": "NORTH", "DEFAULT": "SOUTH" };
tileMovements[Tiles.Cross] = { "SOUTH": "SOUTH", "NORTH": "NORTH", "EAST": "EAST", "WEST": "WEST", "DEFAULT": "SOUTH" };
tileMovements[Tiles.LeftStart] = { "WEST": "WEST" };
tileMovements[Tiles.RightStart] = { "EAST": "EAST" };
tileMovements[Tiles.TopStart] = { "SOUTH": "SOUTH" };
tileMovements[Tiles.BottomStart] = { "NORTH": "NORTH" };
function getNextDirection(currTileId, currDirection) {
    if (!tileMovements[currTileId]) {
        return "NONE";
    }
    if (!tileMovements[currTileId][currDirection]) {
        return "NONE";
    }
    return tileMovements[currTileId][currDirection];
}
function getStartingDirection(startTileId) {
    switch (startTileId) {
        case Tiles.TopStart:
            return "SOUTH";
            break;
        case Tiles.BottomStart:
            return "NORTH";
            break;
        case Tiles.LeftStart:
            return "WEST";
            break;
        case Tiles.RightStart:
            return "EAST";
            break;
        default:
            return "NONE";
            break;
    }
}
// each leaf array represents an start/end coords of line
// [startX, startY, length, direction]
// direction == 0 means vertical
// direction == 1 means horizontal
/*interface OozeProgress {
  startX: number
  startY: number
  length: number
  orientation: number
};*/
var progressByTile = {};
progressByTile[Tiles.BottomLeftTurn] = [
    [1, 11, 4, 0],
    [2, 11, 4, 0],
    [3, 11, 4, 0],
    [4, 11, 4, 0],
    [5, 11, 4, 0],
    [6, 11, 4, 0],
    [7, 11, 4, 0],
    [8, 11, 5, 0],
    [9, 11, 6, 0],
    [10, 11, 7, 0],
    [11, 12, 6, 0],
    [12, 13, 5, 0],
    [13, 14, 4, 0],
    [14, 15, 3, 0],
    [11, 18, 4, 1],
    [11, 19, 4, 1],
    [11, 20, 4, 1],
    [11, 21, 4, 1],
    [11, 22, 4, 1],
    [11, 23, 4, 1],
    [11, 24, 4, 1],
];
progressByTile[Tiles.TopLeftTurn] = [
    [1, 11, 4, 0],
    [2, 11, 4, 0],
    [3, 11, 4, 0],
    [4, 11, 4, 0],
    [5, 11, 4, 0],
    [6, 11, 4, 0],
    [7, 11, 4, 0],
    [8, 10, 5, 0],
    [9, 9, 6, 0],
    [10, 8, 7, 0],
    [11, 8, 6, 0],
    [12, 8, 5, 0],
    [13, 8, 4, 0],
    [14, 8, 3, 0],
    [11, 7, 4, 1],
    [11, 6, 4, 1],
    [11, 5, 4, 1],
    [11, 4, 4, 1],
    [11, 3, 4, 1],
    [11, 2, 4, 1],
    [11, 1, 4, 1]
];
//progressByTile[Tiles.BottomRightTurn] = [
//  [11]
//]
progressByTile[Tiles.TopRightTurn] = [
    [11, 1, 4, 1],
    [11, 2, 4, 1],
    [11, 3, 4, 1],
    [11, 4, 4, 1],
    [11, 5, 4, 1],
    [11, 6, 4, 1],
    [11, 7, 4, 1],
    [11, 8, 5, 1],
    [11, 9, 6, 1],
    [11, 10, 7, 1],
    [12, 11, 6, 1],
    [13, 12, 5, 1],
    [14, 13, 4, 1],
    [15, 14, 3, 1],
    [18, 11, 4, 0],
    [19, 11, 4, 0],
    [20, 11, 4, 0],
    [21, 11, 4, 0],
    [22, 11, 4, 0],
    [23, 11, 4, 0],
    [24, 11, 4, 0],
];
progressByTile[Tiles.Horizontal] = [
    [1, 11, 4, 0],
    [2, 11, 4, 0],
    [3, 11, 4, 0],
    [4, 11, 4, 0],
    [5, 11, 4, 0],
    [6, 11, 4, 0],
    [7, 11, 4, 0],
    [8, 11, 4, 0],
    [9, 11, 4, 0],
    [10, 11, 4, 0],
    [11, 11, 4, 0],
    [12, 11, 4, 0],
    [13, 11, 4, 0],
    [14, 11, 4, 0],
    [15, 11, 4, 0],
    [16, 11, 4, 0],
    [17, 11, 4, 0],
    [18, 11, 4, 0],
    [19, 11, 4, 0],
    [20, 11, 4, 0],
    [21, 11, 4, 0],
    [22, 11, 4, 0],
    [23, 11, 4, 0],
    [24, 11, 4, 0]
];
progressByTile[Tiles.Vertical] = [
    [11, 1, 4, 1],
    [11, 2, 4, 1],
    [11, 3, 4, 1],
    [11, 4, 4, 1],
    [11, 5, 4, 1],
    [11, 6, 4, 1],
    [11, 7, 4, 1],
    [11, 8, 4, 1],
    [11, 9, 4, 1],
    [11, 10, 4, 1],
    [11, 11, 4, 1],
    [11, 12, 4, 1],
    [11, 13, 4, 1],
    [11, 14, 4, 1],
    [11, 15, 4, 1],
    [11, 16, 4, 1],
    [11, 17, 4, 1],
    [11, 18, 4, 1],
    [11, 19, 4, 1],
    [11, 20, 4, 1],
    [11, 21, 4, 1],
    [11, 22, 4, 1],
    [11, 23, 4, 1],
    [11, 24, 4, 1],
];
progressByTile[Tiles.RightStart] = [
    [13, 11, 4, 0],
    [14, 11, 4, 0],
    [15, 11, 4, 0],
    [16, 11, 4, 0],
    [17, 11, 4, 0],
    [18, 11, 4, 0],
    [19, 11, 4, 0],
    [20, 11, 4, 0],
    [21, 11, 4, 0],
    [22, 11, 4, 0],
    [23, 11, 4, 0],
    [24, 11, 4, 0]
];
progressByTile[Tiles.LeftStart] = [
    [1, 11, 4, 0],
    [2, 11, 4, 0],
    [3, 11, 4, 0],
    [4, 11, 4, 0],
    [5, 11, 4, 0],
    [6, 11, 4, 0],
    [7, 11, 4, 0],
    [8, 11, 4, 0],
    [9, 11, 4, 0],
    [10, 11, 4, 0],
    [11, 11, 4, 0],
    [12, 11, 4, 0]
];
progressByTile[Tiles.TopStart] = [
    [11, 1, 4, 1],
    [11, 2, 4, 1],
    [11, 3, 4, 1],
    [11, 4, 4, 1],
    [11, 5, 4, 1],
    [11, 6, 4, 1],
    [11, 7, 4, 1],
    [11, 8, 4, 1],
    [11, 9, 4, 1],
    [11, 10, 4, 1],
    [11, 11, 4, 1],
    [11, 12, 4, 1]
];
progressByTile[Tiles.BottomStart] = [
    [11, 13, 4, 1],
    [11, 14, 4, 1],
    [11, 15, 4, 1],
    [11, 16, 4, 1],
    [11, 17, 4, 1],
    [11, 18, 4, 1],
    [11, 19, 4, 1],
    [11, 20, 4, 1],
    [11, 21, 4, 1],
    [11, 22, 4, 1],
    [11, 23, 4, 1],
    [11, 24, 4, 1]
];
progressByTile[Tiles.TopEnd] = [
    [11, 1, 4, 1],
    [11, 2, 4, 1],
    [11, 3, 4, 1],
    [11, 4, 4, 1],
    [11, 5, 4, 1],
    [11, 6, 4, 1],
    [11, 7, 4, 1],
    [11, 8, 4, 1],
    [11, 9, 4, 1],
    [11, 10, 4, 1],
    [11, 11, 4, 1],
    [11, 12, 4, 1],
];
