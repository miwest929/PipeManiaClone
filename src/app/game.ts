let EMPTY:number = 15;
let CELL_DIM:number = 48;

function adjustValue(value, srcDim, destDim) {
  let aspectRatio: number = destDim / srcDim;
  return value * aspectRatio;
}

let canvas:HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
let ctx:CanvasRenderingContext2D = canvas.getContext('2d');
let pipeGrid:PipeGrid = new PipeGrid(12, 12, CELL_DIM);
pipeGrid.loadPuzzle(getPuzzle(1));

let nextTileBb:BoundingBox = new BoundingBox(640, 20, 120, 580);
let nextTileView:NextTileComponent = new NextTileComponent(nextTileBb.width, nextTileBb.height);
let manager:WindowManager = new WindowManager();

manager.registerComponent(nextTileView, nextTileBb, 55);  

let gridComponent = new PipeGridComponent(pipeGrid);
manager.registerComponent(gridComponent, pipeGrid.boundingBox(20, 20), 101);

let countdownBb:BoundingBox = new BoundingBox(610, 20, 12, 580);
let countdownComponent = new CountdownTimer(countdownBb.width, countdownBb.height);

manager.registerComponent(countdownComponent, countdownBb, 100);

const rotateCBb:BoundingBox = new BoundingBox(660, 135, 32, 32);
const rotateClockwiseBtnComponent = new RotateClockwiseBtnComponent(rotateCBb.width, rotateCBb.height);
manager.registerComponent(rotateClockwiseBtnComponent, rotateCBb, 1);

const rotateCCBb:BoundingBox = new BoundingBox(700, 135, 32, 32);
const rotateCounterClockwiseBtnComponent = new RotateCounterClockwiseBtnComponent(rotateCCBb.width, rotateCCBb.height);
manager.registerComponent(rotateCounterClockwiseBtnComponent, rotateCCBb, 1);

const ffBb:BoundingBox = new BoundingBox(665, 365, 64, 64);
const fastForwardBtnComponent = new FastForwardBtnComponent(ffBb.width, ffBb.height);
manager.registerComponent(fastForwardBtnComponent, ffBb, 1);


// ----------------- EVENT OBSERVERS -------------------
let eventNotifier = new EventNotification();

eventNotifier.attach(COUNTDOWN_FINISHED_EVENT, () => {
  pipeGrid.startOoze();
});

eventNotifier.attach(TILE_DROPPED_EVENT, () => {
  if (!pipeGrid.isOozing) {
    countdownComponent.startCountdown();
  }
});

eventNotifier.attach(ROTATE_NEXT_TILE_COUNTERCLOCKWISE_EVENT, () => {
  nextTileView.rotateNextCounterClockwise();
});

eventNotifier.attach(ROTATE_NEXT_TILE_CLOCKWISE_EVENT, () => {
  nextTileView.rotateNextClockwise();
});

eventNotifier.attach(FAST_FORWARD_OOZE_EVENT, () => {
  pipeGrid.fastForwardOoze();
});


// -----------------------------------------------------

canvas.onclick = (event) => {
  manager.mouseClick(event.offsetX, event.offsetY);
}

canvas.onmousemove = (event) => {
    manager.mouseMove(event.offsetX, event.offsetY);
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

gameLoop();