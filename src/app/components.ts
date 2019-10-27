
interface Component {
    width:number;
    height:number;
    render(ctx:CanvasRenderingContext2D, x:number, y:number): void;
    mouseMove(x:number, y:number): void;
    mouseClick(x:number, y:number): void;
  }
  
  class PipeGridComponent implements Component {
      width:number;
      height:number;
      pipeGrid:PipeGrid;
      
      constructor(pipeGrid) {
          this.pipeGrid = pipeGrid;
      }
  
      render(ctx:CanvasRenderingContext2D, x:number, y:number) {
      }
  
      mouseMove(x:number, y:number) {
        this.pipeGrid.mouseMove(x, y);
      }
  
      mouseClick(x:number, y:number) {
          this.pipeGrid.mouseClick(x, y);
      }
  }
  
  const NEXT_TILE_CNT = 8;
  class NextTileComponent implements Component {
    nextTileIds:number[];
    width:number;
    height:number;
  
    constructor(width:number, height:number) {
      this.width = width;
      this.height = height;
      this.nextTileIds = Array(NEXT_TILE_CNT).fill(0).map(() => {return this.getRandomTileId();});
    }
  
    consumeNextTileId() {
        let tileId = this.nextTileIds.shift();
        this.nextTileIds.push(this.getRandomTileId());
        return tileId;
    }
  
    mouseMove(x:number, y:number) {
    }
  
    mouseClick(x:number, y:number) {
    }
  
    render(ctx:CanvasRenderingContext2D, x:number, y:number) {
      this.renderBorder(ctx, x, y);
  
      ctx.font = "20px verdana";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("NEXT", x + this.width / 4, y + 40);
  
      this.renderImmediateNextTile(ctx, x, y);
      this.renderRemainingNextTiles(ctx, x, y);
    }
  
    private renderImmediateNextTile(ctx:CanvasRenderingContext2D, x:number, y:number) {
      const firstTileId = this.nextTileIds[0];
      tiles[firstTileId].renderAt(ctx, x + (this.width / 4) - 4, y + 50, 64, 64);
  
      // // render border around the very next tile
      // ctx.strokeStyle = "rgb(256, 256, 256)";
      // ctx.lineWidth = 2;
      // ctx.beginPath();
      // ctx.rect(x+(this.width/4)-10, y+48, 68, 68);
      // ctx.stroke();
    }
  
    private renderBorder(ctx:CanvasRenderingContext2D, x:number, y:number) {
      ctx.strokeStyle = "rgb(100,100,100)";
      ctx.lineWidth = 10;
  
      ctx.beginPath();
      ctx.rect(x, y, this.width, this.height);
      ctx.stroke();
    }
  
    private renderRemainingNextTiles(ctx:CanvasRenderingContext2D, x:number, y:number) {
      let nextY = 150;
      this.nextTileIds.slice(1).forEach((tileId) => {
          tiles[tileId].renderAt(ctx, x+(this.width/4)+4, y+nextY, 48, 48);
          nextY += 60;
      });
    }
  
    private getRandomTileId(): number {
      return Math.floor(Math.random() * 7);
    }
  }

// class RotateClockwiseBtnComponent {

// }