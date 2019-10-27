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