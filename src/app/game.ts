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

manager.registerComponent(nextTileView, nextTileBb);  

let gridComponent = new PipeGridComponent(pipeGrid);
manager.registerComponent(gridComponent, pipeGrid.boundingBox(20, 20));

let countdownBb:BoundingBox = new BoundingBox(610, 20, 12, 580);
let countdownComponent = new CountdownTimer(countdownBb.width, countdownBb.height);

manager.registerComponent(countdownComponent, countdownBb);

//let rotateClockwiseBtnComponent = new RotateClockwiseBtnComponent();

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