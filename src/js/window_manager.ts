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
        let comp = this.getInBoundsComponent(x, y);
        if (comp) {
            comp.mouseMove(x, y);
        }
    }

    mouseClick(x:number, y:number) {
        let comp = this.getInBoundsComponent(x, y);
        if (comp) {
            comp.mouseClick(x, y);
        }
    }

    private getInBoundsComponent(x:number, y:number) {
        let c:Component = null;
        this.components.forEach(cbb => {
            if (cbb.bbox.withinBounds(x, y)) {
              c = cbb.component;       
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

class NextTileComponent implements Component {
  nextTileId:number;
  width:number;
  height:number;
  timeLeftSecs:number;
  countdownTimer:number;

  constructor(width:number, height:number) {
    this.width = width;
    this.height = height;
    this.nextTileId = this.getRandomTileId();
    this.timeLeftSecs = 30;
    this.countdownTimer = setInterval(() => { this.timeLeftSecs -= 1;}, 1000);
  }

  mouseMove(x:number, y:number) {
  }

  mouseClick(x:number, y:number) {
  }

  render(ctx:CanvasRenderingContext2D, x:number, y:number) {
    ctx.strokeStyle = "rgb(100,100,100)";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.rect(x, y, this.width, this.height);
    ctx.stroke();
  
    this.renderNextTileView(ctx, x, y);
    this.renderTimerView(ctx, x, y);
  }

  private renderNextTileView(ctx, x, y) {
    ctx.font = "20px verdana";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("NEXT", x+10, y+40);

    tiles[this.nextTileId].renderAt(ctx, x+(this.width/4), y+50, 32, 32);
  }

  private renderTimerView(ctx, x, y) {
    ctx.font = "20px verdana";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("TIME", x+10, y+120);

    ctx.font = "20px verdana";
    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.fillText(this.timeLeftSecs.toString(), x+10, y+150);
  }

  private getRandomTileId() {
    return Math.floor(Math.random() * 6);
  }
}