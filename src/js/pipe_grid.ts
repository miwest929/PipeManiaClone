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

    mouseMove(x:number, y:number) {
      console.log("MouseMove: ", x, y);
    }

    mouseClick(x:number, y:number) {
        console.log("MouseClick: ", x, y);
        this.startOoze();
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
        if (tileId === Tiles.Cross) {
            if (this.oozeDirection === "WEST" || this.oozeDirection === "EAST") {
                tileId = Tiles.CrossHorizontal;
            } else {
                tileId = Tiles.CrossVertical;
            }
        }

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
      if (tileId === Tiles.Cross) {
        if (this.oozeDirection === "WEST" || this.oozeDirection === "EAST") {
            tileId = Tiles.CrossHorizontal;
        } else {
            tileId = Tiles.CrossVertical;
        }
      }
      let oozeProgress: number[][] = progressByTile[tileId];
  
      if (oozeProgress) {
        let idx: number = Math.floor(this.oozeProgressInCell * oozeProgress.length);
        this.renderOozeCell(ctx, cellX, cellY, tileId, idx);
      }
    }

    boundingBox(x:number, y:number) {
        return new BoundingBox(x, y, this.widthInPx, this.heightInPx);
    }
  
    private renderOozeCell(ctx: CanvasRenderingContext2D, x: number, y: number, tileId: number, progress: number) {
      let oozeProgress: number[][] = progressByTile[tileId];
      for (let i:number = 0; i <= progress; i++) {
        let idx:number = i;
        if (this.oozeReverse) {
            idx = progress - i;
        }

        let progressLine: number[] = oozeProgress[idx];
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