var EMPTY = 15;
var CELL_DIM = 48;
function adjustValue(value, srcDim, destDim) {
    var aspectRatio = destDim / srcDim;
    return value * aspectRatio;
}
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var pipeGrid = new PipeGrid(12, 12, CELL_DIM, [0, 0, Tiles.RightStart], [1, 2, Tiles.TopEnd]);
pipeGrid.placeTile(Tiles.Horizontal, 0, 1);
pipeGrid.placeTile(Tiles.BottomLeftTurn, 0, 2);
pipeGrid.placeTile(Tiles.Vertical, 1, 2);
pipeGrid.placeTile(Tiles.Vertical, 2, 2);
pipeGrid.placeTile(Tiles.Vertical, 3, 2);
pipeGrid.placeTile(Tiles.TopLeftTurn, 4, 2);
pipeGrid.placeTile(Tiles.TopRightTurn, 4, 1);
pipeGrid.placeTile(Tiles.BottomLeftTurn, 3, 1);
pipeGrid.placeTile(Tiles.BottomRightTurn, 3, 0);
pipeGrid.placeTile(Tiles.Vertical, 4, 0);
pipeGrid.placeTile(Tiles.Vertical, 5, 0);
pipeGrid.placeTile(Tiles.Vertical, 6, 0);
pipeGrid.placeTile(Tiles.TopRightTurn, 7, 0);
pipeGrid.placeTile(Tiles.Horizontal, 7, 1);
pipeGrid.placeTile(Tiles.Horizontal, 7, 2);
pipeGrid.placeTile(Tiles.Cross, 7, 3);
pipeGrid.placeTile(Tiles.LeftEnd, 7, 4);
function setupViews() {
    var manager = new WindowManager();
    var nextTileBb = new BoundingBox(620, 20, 80, 400);
    var nextTileView = new NextTileComponent(nextTileBb.width, nextTileBb.height);
    manager.registerComponent(nextTileView, nextTileBb);
    var gridComponent = new PipeGridComponent(pipeGrid);
    manager.registerComponent(gridComponent, pipeGrid.boundingBox(20, 20));
    return manager;
}
function render(ctx) {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pipeGrid.render(ctx, 20, 20);
    manager.render(ctx, 0, 0);
}
function update() {
    pipeGrid.update();
}
function gameLoop() {
    render(ctx);
    update();
    window.requestAnimationFrame(gameLoop);
}
var manager = setupViews();
gameLoop();
