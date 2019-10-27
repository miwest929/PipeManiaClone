interface Array<T> {
    fill(value: T): Array<T>;
}

class BoundingBox {
    x:number;
    y:number;
    width:number;
    height:number;

    constructor(x:number, y:number, width:number, height:number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    withinBounds(ptx:number, pty:number) {
        let withinX = ptx >= this.x && ptx <= (this.x + this.width);
        let withinY = pty >= this.y && pty <= (this.y + this.height);
        return withinX && withinY;
    }
}

type ComponentBoundingBox = {
  component:Component;
  bbox:BoundingBox;
}

class WindowManager {
    components:ComponentBoundingBox[];

    constructor() {
        this.components = [];
    }

    registerComponent(component:Component, bbox:BoundingBox) {
        let compBb:ComponentBoundingBox = {component, bbox};
        this.components.push(compBb);
    }

    render(ctx:CanvasRenderingContext2D, x:number, y:number) {
      this.components.forEach(cbb => {
        let bb = cbb.bbox;
        cbb.component.render(ctx, bb.x, bb.y);
      });
    }

    mouseMove(x:number, y:number) {
        console.log(`MouseMove: ${x}, ${y}`);
        let cbb = this.getInBoundsComponent(x, y);
        if (cbb) {
            cbb.component.mouseMove(x-cbb.bbox.x, y-cbb.bbox.y);
        }
    }

    mouseClick(x:number, y:number) {
        let cbb = this.getInBoundsComponent(x, y);
        if (cbb) {
            cbb.component.mouseClick(x-cbb.bbox.x, y-cbb.bbox.y);
        }
    }

    private getInBoundsComponent(x:number, y:number) {
        let c:ComponentBoundingBox = null;
        this.components.forEach(cbb => {
            if (cbb.bbox.withinBounds(x, y)) {
              c = cbb;       
            }
        });

        return c;
    }
}

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
    ctx.fillText("NEXT", x+10, y+40);

    this.renderImmediateNextTile(ctx, x, y);
    this.renderRemainingNextTiles(ctx, x, y);
  }

  private renderImmediateNextTile(ctx:CanvasRenderingContext2D, x:number, y:number) {
    tiles[0].renderAt(ctx, x + (this.width / 4) - 8, y + 50, 64, 64);

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
        tiles[tileId].renderAt(ctx, x+(this.width/4)-8, y+nextY, 48, 48);
        nextY += 60;
    });
  }

  private getRandomTileId(): number {
    return Math.floor(Math.random() * 7);
  }
}