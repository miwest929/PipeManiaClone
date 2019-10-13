class WindowManager {
    components:Component[];

    constructor() {
        this.components = [];
    }

    registerComponent(component:Component) {
        this.components.push(component);
    }

    render(ctx:CanvasRenderingContext2D, x:number, y:number) {
      this.components.forEach(c => {
        c.render(ctx, x, y);
      });
    }
}

interface Component {
  render(ctx:CanvasRenderingContext2D, x:number, y:number): void;
}

class NextTileComponent implements Component {
  nextTileId:number;

  constructor() {
    this.nextTileId = this.getRandomTileId();
  }

  render(ctx:CanvasRenderingContext2D, x:number, y:number) {
    const WIDTH = 80;
    const HEIGHT = 100;
    ctx.strokeStyle = "rgb(100,100,100)";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.rect(x, y, WIDTH, HEIGHT);
    ctx.stroke();

    ctx.font = "20px verdana";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("NEXT", x+10, y+40);

    tiles[this.nextTileId].renderAt(ctx, x+(WIDTH/4), y+(HEIGHT/2), 32, 32);
  }

  private getRandomTileId() {
    return Math.floor(Math.random() * 6);
  }
}