import {glo} from "./globals.js";
import Rect from "./Rect.js";
export default class Model 
{
    ZOOM_STEP = 10;
    depthLimit = 1000;
    maxDepth = this.depthLimit;
    minDepth = 0;
    avgDepth = 0;
    

    scope: Rect;  
    
    depths: number[];
    
    K0: number;    // initial scale
     
    constructor(init: Rect) {
        this.scope = init;

        this.K0 = init.w / glo.canvas.width;
        this.depths = new Array(glo.canvas.width * glo.canvas.height);  

        this.setDepths();
    }

    // obtained scale
    get scale() { return this.scope.w / glo.canvas.width; }
    
    
    getDeep(canvX: number, canvY: number) {
        return this.depths[canvY * glo.canvas.width + canvX] ?? 0;
    }

    setDepths() {
        this.minDepth = this.maxDepth = this.countDeep(0, 0);
        this.avgDepth = 0;
        let k = this.scale;       
        for (let y = 0; y < glo.canvas.height; y++) {
            let windY = y * k + this.scope.y;
            for (let x = 0; x < glo.canvas.width; x++) {
                let windX = x * k + this.scope.x; 
                let depth = this.countDeep(windX, windY);            
                this.depths[y * glo.canvas.width + x] = depth;
                if (this.minDepth > depth) this.minDepth = depth;
                if (this.maxDepth < depth) this.maxDepth = depth; 
                this.avgDepth += depth;         
            }
        }
        this.avgDepth /= this.depths.length;
    }


    countDeep(wx: number, wy: number) {
        let x = wx, y = wy;
        for (let i = 0; i < this.depthLimit; i++) {
            [x, y] = [x * x - y * y + wx, 2 * x * y + wy];
            if ((x * x) + (y * y) > 4)
                return i;
        }
        return this.depthLimit;
    }

    scaleWindow(canvX: number, canvY: number, zoom: number) { 
        let centerX = canvX * this.scale + this.scope.x;   
        let centerY = canvY * this.scale + this.scope.y;
        this.scope.w /= zoom;
        this.scope.h /= zoom;
        this.scope.x = centerX - this.scope.w / 2;
        this.scope.y = centerY - this.scope.h / 2;

        this.setDepths();      
    }

    export(): string {
        return JSON.stringify(this.scope);
    }

    import(line: string) {
        this.scope = <Rect>JSON.parse(line);
        this.setDepths();
    }

} 