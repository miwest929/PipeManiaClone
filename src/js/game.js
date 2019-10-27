var EMPTY = 15;
var CELL_DIM = 48;
function adjustValue(value, srcDim, destDim) {
    var aspectRatio = destDim / srcDim;
    return value * aspectRatio;
}
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var pipeGrid = new PipeGrid(12, 12, CELL_DIM);
pipeGrid.loadPuzzle(getPuzzle(1));
var nextTileBb = new BoundingBox(640, 20, 120, 580);
var nextTileView = new NextTileComponent(nextTileBb.width, nextTileBb.height);
var manager = new WindowManager();
manager.registerComponent(nextTileView, nextTileBb, 55);
var gridComponent = new PipeGridComponent(pipeGrid);
manager.registerComponent(gridComponent, pipeGrid.boundingBox(20, 20), 101);
var countdownBb = new BoundingBox(610, 20, 12, 580);
var countdownComponent = new CountdownTimer(countdownBb.width, countdownBb.height);
manager.registerComponent(countdownComponent, countdownBb, 100);
var rotateCBb = new BoundingBox(670, 135, 24, 24);
var rotateClockwiseBtnComponent = new RotateClockwiseBtnComponent(rotateCBb.width, rotateCBb.height);
manager.registerComponent(rotateClockwiseBtnComponent, rotateCBb, 1);
var rotateCCBb = new BoundingBox(710, 135, 24, 24);
var rotateCounterClockwiseBtnComponent = new RotateCounterClockwiseBtnComponent(rotateCCBb.width, rotateCCBb.height);
manager.registerComponent(rotateCounterClockwiseBtnComponent, rotateCCBb, 1);
// ----------------- EVENT OBSERVERS -------------------
var eventNotifier = new EventNotification();
eventNotifier.attach(COUNTDOWN_FINISHED_EVENT, function () {
    pipeGrid.startOoze();
});
eventNotifier.attach(TILE_DROPPED_EVENT, function () {
    if (!pipeGrid.isOozing) {
        countdownComponent.startCountdown();
    }
});
eventNotifier.attach(ROTATE_NEXT_TILE_COUNTERCLOCKWISE, function () {
    nextTileView.rotateNextCounterClockwise();
});
eventNotifier.attach(ROTATE_NEXT_TILE_CLOCKWISE, function () {
    nextTileView.rotateNextClockwise();
});
// -----------------------------------------------------
canvas.onclick = function (event) {
    manager.mouseClick(event.offsetX, event.offsetY);
};
canvas.onmousemove = function (event) {
    manager.mouseMove(event.offsetX, event.offsetY);
};
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
gameLoop();
