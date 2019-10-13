let EMPTY:number = 15;

function adjustValue(value, srcDim, destDim) {
  let aspectRatio: number = destDim / srcDim;
  return value * aspectRatio;
}

class PipeGrid {
  rows: number;
  cols: number;
  widthInPx: number;
  heightInPx: number;
  cellDim: number;
  grid: number[][];
  startLocation: [number, number, number];
  endLocation: [number, number, number];

  isOozing: boolean;
  oozeRow: number;
  oozeCol: number;
  oozeProgressInCell: number;
  oozeDirection: string; // what direction is the ooze traveling towards
  oozedCells: number[][]; // array of coords array
  oozeReverse: boolean; // should render ooze in reverse

  constructor(rows: number, cols: number, cellDim: number, startLoc: [number, number, number], endLoc: [number, number, number]) {
    this.rows = rows;
    this.cols = cols;
    this.cellDim = cellDim;
    this.widthInPx = this.cols * this.cellDim;
    this.heightInPx = this.rows * this.cellDim;
    this.startLocation = startLoc;
    this.endLocation = endLoc;
    this.grid = this.initGrid();
  }

  placeTile(tileId:number, row:number, col:number) {
    this.grid[row][col] = tileId;
  }

  startOoze() {
    this.isOozing = true;
    this.oozeRow = this.startLocation[0];
    this.oozeCol = this.startLocation[1];
    this.oozeProgressInCell = 0.0;
    this.oozedCells = [];
    this.oozeDirection = getStartingDirection(this.grid[this.oozeRow][this.oozeCol]);
    this.oozeReverse = false;
  }

  initGrid() {
    this.grid = [];
  
    for (let r = 0; r < this.rows; r++) {
      let arr:number[] = [];
      for (let c = 0; c < this.cols; c++) {
        arr.push(EMPTY);
      }
      this.grid.push(arr);
    }

    this.placeTile(this.startLocation[2], this.startLocation[0], this.startLocation[1])
    this.placeTile(this.endLocation[2], this.endLocation[0], this.endLocation[1]);

    return this.grid;
  }

  update() {
    if (this.isOozing) {
      this.oozeProgressInCell += 0.02;

      // ooze overflowed current cell. Move on to the next
      if (this.oozeProgressInCell > 1.0) {
        this.oozeProgressInCell = 0.0;
        let oozeCell: number = this.grid[this.oozeRow][this.oozeCol];
        if (tileMovements[oozeCell]) {
          this.oozeDirection = getNextDirection(oozeCell, this.oozeDirection);
          this.oozedCells.push([this.oozeRow, this.oozeCol]);
          let newCoords = this.getNextOozeCell(this.oozeDirection);
          this.oozeRow = newCoords[0];
          this.oozeCol = newCoords[1];
          let newTileId: number = this.grid[this.oozeRow][this.oozeCol];
          this.oozeReverse = tileMovements[newTileId]["DEFAULT"] !== this.oozeDirection;
        }
      }
    }
  }

  render(ctx: CanvasRenderingContext2D, x: number, y: number) {
    this.renderGrid(ctx, x, y);
    this.renderCells(ctx, x, y);

    if (this.isOozing) {
      this.renderOoze(ctx, x, y);
    }
  }

  renderGrid(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.strokeStyle = "rgb(256, 256, 256)";
    ctx.lineWidth = 1;

    // render horizontal lines
    let startY:number = y;
    for (let i:number = 0; i <= this.rows; i++, startY+=this.cellDim) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x + this.widthInPx, startY);
      ctx.stroke();
    }   

    // render vertical lines
    let startX:number = x;
    for (let i:number = 0; i <= this.cols; i++, startX+=this.cellDim) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX, y + this.heightInPx);
      ctx.stroke();
    }
  }

  renderCells(ctx: CanvasRenderingContext2D, x: number, y: number) {
    let rX:number = x;
    let rY:number = y;
    for (let r = 0; r < this.rows; r++, rY += this.cellDim) {
      rX = x;
      for (let c = 0; c < this.cols; c++, rX += this.cellDim) {
        tiles[this.grid[r][c]].renderAt(ctx, rX, rY, this.cellDim, this.cellDim);
      }
    }
  }

  renderOoze(ctx: CanvasRenderingContext2D, x: number, y: number) {
    // render already oozed cells
    for (let i:number = 0; i < this.oozedCells.length; i++) {
      let row: number = this.oozedCells[i][0];
      let col: number = this.oozedCells[i][1];
      let tileId: number = this.grid[row][col];
      let oozedX: number = col * this.cellDim + x;
      let oozedY: number = row * this.cellDim + y;
      let oozeProgress: number[][] = progressByTile[tileId];
      if (oozeProgress) {
        this.renderOozeCell(ctx, oozedX, oozedY, tileId, oozeProgress.length);
      }
    }

    let cellX: number = this.oozeCol * this.cellDim + x;
    let cellY: number = this.oozeRow * this.cellDim + y;
    let tileId: number = this.grid[this.oozeRow][this.oozeCol];
    let oozeProgress: number[][] = progressByTile[tileId];

    if (oozeProgress) {
      let idx: number = Math.floor(this.oozeProgressInCell * oozeProgress.length);
      this.renderOozeCell(ctx, cellX, cellY, tileId, idx);
    }
  }

  private renderOozeCell(ctx: CanvasRenderingContext2D, x: number, y: number, tileId: number, progress: number) {
    let oozeProgress: number[][] = progressByTile[tileId];
    let startIdx: number = 0;
    let deltaIdx: number = 1;
    let shouldEndFn = (idx) => { return idx <= progress; };
    if (this.oozeReverse) {
      startIdx = progress;
      deltaIdx = -1;
      shouldEndFn = (idx) => { return idx >= 0; };
    }
    for (let i:number = startIdx; shouldEndFn(i); i += deltaIdx) {
      let progressLine: number[] = oozeProgress[i];
      if (progressLine) {
        let adjustedX = adjustValue(progressLine[0], TILE_DIM, this.cellDim);
        let adjustedY = adjustValue(progressLine[1], TILE_DIM, this.cellDim);
        let adjustedLength = adjustValue(progressLine[2], TILE_DIM, this.cellDim);
        this.renderOozeLine(x + adjustedX, y + adjustedY, adjustedLength, progressLine[3]);
      }
    }
  }
  
  private getNextOozeCell(direction) {
    let deltaRow: number = 0;
    let deltaCol: number = 0;

    if (direction === "NORTH") {
      deltaRow = -1;
    } else if (direction === "SOUTH") {
      deltaRow = 1;
    } else if (direction === "WEST") {
      deltaCol = -1;
    } else if (direction === "EAST") {
      deltaCol = 1;
    }

    return [this.oozeRow + deltaRow, this.oozeCol + deltaCol];
  }

  private renderOozeLine(startX: number, startY: number, length: number, direction: number) {
    ctx.strokeStyle = "rgb(0, 153, 51)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(startX, startY);

    if (direction == 0) { // vertical
      ctx.lineTo(startX, startY + length);
    } else if (direction == 1) { // horizontal
      ctx.lineTo(startX + length, startY);
    }
    ctx.stroke();
  }
}

let CELL_DIM:number = 48;
let canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
let ctx:CanvasRenderingContext2D = canvas.getContext('2d');
let pipeGrid:PipeGrid = new PipeGrid(
  12, 12, CELL_DIM, [0, 0, Tiles.RightStart], [1, 2, Tiles.TopEnd]
);
let manager:WindowManager = new WindowManager();
let nextTileView:NextTileComponent = new NextTileComponent();
manager.registerComponent(nextTileView);

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

function render(ctx) {
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  pipeGrid.render(ctx, 20, 20);
  manager.render(ctx, 620, 20);
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