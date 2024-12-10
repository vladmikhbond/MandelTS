import {glo} from "./globals.js";
import Rect from "./Rect.js";
export default class Model 
{
    ZOOM_STEP = 10;
    depthLimit = 10;
    maxDepth = this.depthLimit;
    minDepth = 0;

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
    
    getDeep(canvX: number, canvY: number) {
        return this.deeps[canvY * glo.canvas.width + canvX] ?? 0;
    }

    private fillDeeps() {
        this.minDepth = this.maxDepth = this.countDeep(0, 0);  
        let k = this.scale;       
        for (let y = 0; y < glo.canvas.height; y++) {
            let windY = y * k + this.scope.y;
            for (let x = 0; x < glo.canvas.width; x++) {
                let windX = x * k + this.scope.x; 
                let deep = this.countDeep(windX, windY);            
                this.deeps[y * glo.canvas.width + x] = deep;
                if (this.minDepth > deep) this.minDepth = deep;
                if (this.maxDepth < deep) this.maxDepth = deep;          
            }
        }
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