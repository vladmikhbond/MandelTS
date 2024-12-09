import {glo} from "./globals.js";
import Rect from "./Rect.js";
export default class Model 
{
    ZOOM_STEP = 10;
    DEEP_LIMIT = 1000;
    
    scope: Rect;
    
    deeps: number[];
    // initial scale
    K0: number;
     
    constructor(init: Rect) {
        this.scope = init;

        this.K0 = init.w / glo.canvas.width;
        this.deeps = new Array(glo.canvas.width * glo.canvas.height);  

        this.fillDeeps();
    }
    // obtained scale
    get K() { return this.scope.w / glo.canvas.width; }
    

    private fillDeeps() { 
        let k = this.K;       
        for (let y = 0; y < glo.canvas.height; y++) {
            let windY = y * k + this.scope.y;
            for (let x = 0; x < glo.canvas.width; x++) {
                let windX = x * k + this.scope.x;             
                this.deeps[y * glo.canvas.width + x] = this.countDeep(windX, windY);
            }
        }
    }


    countDeep(wx: number, wy: number) {
        let x = wx, y = wy;
        for (let i = 0; i < this.DEEP_LIMIT; i++) {
            [x, y] = [x * x - y * y + wx, 2 * x * y + wy];
            if ((x * x) + (y * y) > 4)
                return i;
        }
        return this.DEEP_LIMIT;
    }

    scaleWindow(canvX: number, canvY: number, zoom = this.ZOOM_STEP) { 
        let centerX = canvX * this.K + this.scope.x;   
        let centerY = canvY * this.K + this.scope.y;
        this.scope.w /= zoom;
        this.scope.h /= zoom;
        this.scope.x = centerX - this.scope.w / 2;
        this.scope.y = centerY - this.scope.h / 2;

        this.fillDeeps();      
    }



} 