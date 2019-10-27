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

type RegisteredComponent = {
  component:Component;
  bbox:BoundingBox;
  zIndex:number;
}

class WindowManager {
    components:RegisteredComponent[];

    constructor() {
        this.components = [];
    }

    registerComponent(component:Component, bbox:BoundingBox, zIndex: number) {
        let compBb:RegisteredComponent = {component, bbox, zIndex};
        this.components.push(compBb);
    }

    render(ctx:CanvasRenderingContext2D, x:number, y:number) {
      this.components.forEach(cbb => {
        let bb = cbb.bbox;
        cbb.component.render(ctx, bb.x, bb.y);
      });
    }

    mouseMove(x:number, y:number) {
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
        let c:RegisteredComponent = null;
        let currZ:number = 1000000.0;
        this.components.forEach(rc => {
            if (rc.bbox.withinBounds(x, y) && rc.zIndex < currZ) {
              c = rc;    
              currZ = rc.zIndex;   
            }
        });

        return c;
    }
}