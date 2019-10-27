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
var rotateCBb = new BoundingBox(660, 135, 32, 32);
var rotateClockwiseBtnComponent = new RotateClockwiseBtnComponent(rotateCBb.width, rotateCBb.height);
manager.registerComponent(rotateClockwiseBtnComponent, rotateCBb, 1);
var rotateCCBb = new BoundingBox(700, 135, 32, 32);
var rotateCounterClockwiseBtnComponent = new RotateCounterClockwiseBtnComponent(rotateCCBb.width, rotateCCBb.height);
manager.registerComponent(rotateCounterClockwiseBtnComponent, rotateCCBb, 1);
var ffBb = new BoundingBox(665, 365, 64, 64);
var fastForwardBtnComponent = new FastForwardBtnComponent(ffBb.width, ffBb.height);
manager.registerComponent(fastForwardBtnComponent, ffBb, 1);
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
eventNotifier.attach(ROTATE_NEXT_TILE_COUNTERCLOCKWISE_EVENT, function () {
    nextTileView.rotateNextCounterClockwise();
});
eventNotifier.attach(ROTATE_NEXT_TILE_CLOCKWISE_EVENT, function () {
    nextTileView.rotateNextClockwise();
});
eventNotifier.attach(FAST_FORWARD_OOZE_EVENT, function () {
    pipeGrid.fastForwardOoze();
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
