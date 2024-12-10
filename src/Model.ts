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
    
    deeps: number[];
    
    K0: number;    // initial scale
     
    constructor(init: Rect) {
        this.scope = init;

        this.K0 = init.w / glo.canvas.width;
        this.deeps = new Array(glo.canvas.width * glo.canvas.height);  

        this.fillDeeps();
    }

    // obtained scale
    get scale() { return this.scope.w / glo.canvas.width; }
    //get relativeScale() { return this.scale * this.K0; }
    
    
    getDeep(canvX: number, canvY: number) {
        return this.deeps[canvY * glo.canvas.width + canvX] ?? 0;
    }

    private fillDeeps() {
        this.minDepth = this.maxDepth = this.countDeep(0, 0);
        this.avgDepth = 0;
        let k = this.scale;       
        for (let y = 0; y < glo.canvas.height; y++) {
            let windY = y * k + this.scope.y;
            for (let x = 0; x < glo.canvas.width; x++) {
                let windX = x * k + this.scope.x; 
                let depth = this.countDeep(windX, windY);            
                this.deeps[y * glo.canvas.width + x] = depth;
                if (this.minDepth > depth) this.minDepth = depth;
                if (this.maxDepth < depth) this.maxDepth = depth; 
                this.avgDepth += depth;         
            }
        }
        this.avgDepth /= this.deeps.length;
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

    scaleWindow(canvX: number, canvY: number, zoom = this.ZOOM_STEP) { 
        let centerX = canvX * this.scale + this.scope.x;   
        let centerY = canvY * this.scale + this.scope.y;
        this.scope.w /= zoom;
        this.scope.h /= zoom;
        this.scope.x = centerX - this.scope.w / 2;
        this.scope.y = centerY - this.scope.h / 2;

        this.fillDeeps();      
    }



} 