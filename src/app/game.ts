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

let nextTileBb:BoundingBox = new BoundingBox(620, 20, 80, 580);
let nextTileView:NextTileComponent = new NextTileComponent(nextTileBb.width, nextTileBb.height);
function setupViews() {
  let manager:WindowManager = new WindowManager();

  //let nextTileBb:BoundingBox = new BoundingBox(620, 20, 80, 400);
  //let nextTileView:NextTileComponent = new NextTileComponent(nextTileBb.width, nextTileBb.height);
  manager.registerComponent(nextTileView, nextTileBb);  

  let gridComponent = new PipeGridComponent(pipeGrid);
  manager.registerComponent(gridComponent, pipeGrid.boundingBox(20, 20));

  //let countdownBb:BoundingBox = new BoundingBox(580, 20, 30, 580);
  let countdownComponent = new CountdownTimer(10, 580, () => {
    pipeGrid.startOoze();
  });
  manager.registerComponent(countdownComponent, pipeGrid.boundingBox(20, 20));

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

let manager = setupViews();
gameLoop();