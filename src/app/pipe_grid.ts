const OOZING_DELAY_MS = 2000.0;

class PipeGrid {
    rows: number;
    cols: number;
    widthInPx: number;
    heightInPx: number;
    cellDim: number;
    grid: number[][];
    startLocation: [number, number, number];
    endLocation: [number, number, number];

    hoveredRow: number;
    hoveredCol: number;
  
    isOozing: boolean;
    oozeRow: number;
    oozeCol: number;
    oozeProgressInCell: number;
    oozeDirection: string; // what direction is the ooze traveling towards
    oozedCells: number[][]; // array of coords array
    oozeReverse: boolean; // should render ooze in reverse
    oozeProgressTick: number;
  
    constructor(rows: number, cols: number, cellDim: number) {
      this.rows = rows;
      this.cols = cols;
      this.cellDim = cellDim;
      this.widthInPx = this.cols * this.cellDim;
      this.heightInPx = this.rows * this.cellDim;
      this.startLocation = [0,0,0];
      this.endLocation = [0,0,0];
      this.hoveredRow = -1;
      this.hoveredCol = -1;
      this.oozeProgressTick = 0.005;
      this.grid = this.initGrid();
    }
  
    public placeTile(tileId:number, row:number, col:number) {
      this.grid[row][col] = tileId;
    }

    public loadPuzzle(puzzle: Puzzle): void {
      const startTileId = this.convertToStartTileId(puzzle.startOrient);
      this.placeTile(startTileId, puzzle.startCoord.row, puzzle.startCoord.col);
      this.startLocation[0] = puzzle.startCoord.row;
      this.startLocation[1] = puzzle.startCoord.col;
      this.startLocation[2] = startTileId;

      const endTileId = this.convertToEndTileId(puzzle.endOrient);
      this.placeTile(endTileId, puzzle.endCoord.row, puzzle.endCoord.col);
      this.endLocation[0] = puzzle.endCoord.row;
      this.endLocation[1] = puzzle.endCoord.col;
      this.endLocation[2] = endTileId;

      puzzle.blocks.forEach((b) => {
        this.placeTile(Tiles.Indestructible, b.row, b.col);        
      });
    }

    private convertToStartTileId(direction: string): number {
      switch (direction) {
        case "NORTH":
        return Tiles.TopStart;
          break;
        case "SOUTH":
        return Tiles.BottomStart;
          break;
        case "WEST":
        return Tiles.LeftStart;
          break;
        case "EAST":
          return Tiles.RightStart;
          break;
      }
    }

    private convertToEndTileId(direction: string): number {
      switch (direction) {
        case "NORTH":
        return Tiles.TopEnd;
          break;
        case "SOUTH":
        return Tiles.BottomEnd;
          break;
        case "WEST":
        return Tiles.LeftEnd;
          break;
        case "EAST":
        return Tiles.RightEnd;
          break;
      }      
    } 

    public startOoze() {
      if (!this.isOozing) {
        this.oozeProgressTick = 0.005;
        this.isOozing = true;
        this.oozeRow = this.startLocation[0];
        this.oozeCol = this.startLocation[1];
        this.oozeProgressInCell = 0.0;
        this.oozedCells = [];
        this.oozeDirection = getStartingDirection(this.grid[this.oozeRow][this.oozeCol]);
        this.oozeReverse = false;
      }
    }
  
    private initGrid() {
      this.grid = [];
    
      for (let r = 0; r < this.rows; r++) {
        let arr:number[] = [];
        for (let c = 0; c < this.cols; c++) {
          arr.push(EMPTY);
        }
        this.grid.push(arr);
      }
  
      return this.grid;
    }
  
    update() {
      if (this.isOozing) {
        this.oozeProgressInCell += this.oozeProgressTick;
  
        // ooze overflowed current cell. Move on to the next
        if (this.oozeProgressInCell > 1.0) {
          console.log("Overflowed. Flowing to next Tile");
          this.oozeProgressInCell = 0.0;
          let oozeCellId: number = this.grid[this.oozeRow][this.oozeCol];
          if (tileMovements[oozeCellId]) {
            this.oozeDirection = getNextDirection(oozeCellId, this.oozeDirection);
            console.log(`Default = ${tileMovements[oozeCellId]["DEFAULT"]}, NextDirection = ${this.oozeDirection}`);            
            this.oozedCells.push([this.oozeRow, this.oozeCol]);
            let newCoords = this.getNextOozeCell(this.oozeDirection);
            if (this.areConnected(newCoords[0], newCoords[1], this.oozeDirection)) {
              this.oozeRow = newCoords[0];
              this.oozeCol = newCoords[1];
              let newTileId: number = this.grid[this.oozeRow][this.oozeCol];
              this.oozeReverse = tileMovements[newTileId]["DEFAULT"] !== this.oozeDirection;
            } else {
              console.log("GAME OVER!");
            }
          }
        }
      }
    }

    mouseMove(x:number, y:number) {
      this.hoveredRow = Math.floor(y / this.cellDim);
      this.hoveredCol = Math.floor(x / this.cellDim);
    }

    mouseClick(x:number, y:number) {
        if (!isNonReplacableTile(this.grid[this.hoveredRow][this.hoveredCol])) {
          eventNotifier.notify(TILE_DROPPED_EVENT, {});
          this.grid[this.hoveredRow][this.hoveredCol] = nextTileView.consumeNextTileId();
        }
    }
    
    fastForwardOoze() {
      this.oozeProgressTick = 0.25;
    }

    render(ctx: CanvasRenderingContext2D, x: number, y: number) {
      this.renderGrid(ctx, x, y);
      this.renderCells(ctx, x, y);
  
      if (this.isOozing) {
        this.renderOoze(ctx, x, y);
      }

      if (this.hoveredCol !== -1 && this.hoveredRow !== -1) {
        let hoveredX:number = this.hoveredCol * this.cellDim;
        let hoveredY:number = this.hoveredRow * this.cellDim;
        ctx.strokeStyle = "rgb(256,256,256)";
        ctx.lineWidth = 2;
    
        ctx.beginPath();
        ctx.rect(hoveredX+x, hoveredY+y, this.cellDim, this.cellDim);
        ctx.stroke();
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

    private areConnected(nextRow: number, nextCol: number, direction: string): boolean {
      const nextTileId = this.grid[nextRow][nextCol];
      return !!(tileMovements[nextTileId] && tileMovements[nextTileId][direction]);
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
      ctx.strokeStyle = "rgb(153, 255, 179)";
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