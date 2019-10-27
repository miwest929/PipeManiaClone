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
manager.registerComponent(nextTileView, nextTileBb);
var gridComponent = new PipeGridComponent(pipeGrid);
manager.registerComponent(gridComponent, pipeGrid.boundingBox(20, 20));
var countdownBb = new BoundingBox(610, 20, 12, 580);
var countdownComponent = new CountdownTimer(countdownBb.width, countdownBb.height);
manager.registerComponent(countdownComponent, countdownBb);
//let rotateClockwiseBtnComponent = new RotateClockwiseBtnComponent();
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
